import {
  Connection,
  PublicKey,
  Transaction,
  TransactionSignature,
  SignatureStatus,
} from "@solana/web3.js";
import {
  Tributary,
  PaymentFrequency,
  UserPayment,
  createMemoBuffer,
} from "@tributary-so/sdk";
import * as anchor from "@coral-xyz/anchor";
import BN from "bn.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import config from "../constants";

export type { PaymentFrequency };

export interface SubscriptionPolicy {
  id: number;
  from: PublicKey;
  to: PublicKey;
  amount: BN;
  frequency: PaymentFrequency;
  status: "active" | "paused";
  nextPaymentDue: BN;
  totalPaid: BN;
  createdAt: BN;
}

export interface PayAsYouGoPolicy {
  id: number;
  from: PublicKey;
  to: PublicKey;
  maxAmountPerPeriod: BN;
  maxChunkAmount: BN;
  periodLength: BN;
  status: "active" | "paused";
  totalPaid: BN;
  createdAt: BN;
}

export interface CreateSubscriptionParams {
  parentWallet: WalletContextState;
  childWallet: PublicKey;
  amountUSD: number;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
}

export interface CreatePayAsYouGoParams {
  humanWallet: WalletContextState;
  agentWallet: PublicKey;
  maxBudget: number;         // Max USDC per period (e.g., €500)
  maxPerClaim: number;       // Max per single claim (e.g., €50)
  periodDays: number;        // Period length in days (e.g., 30 days)
}

export interface PolicyListResult {
  subscriptions: SubscriptionPolicy[];
  payAsYouGo: PayAsYouGoPolicy[];
  userPaymentPubkey: PublicKey | null;
}

interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

async function confirmTransactionWithStatus(
  connection: Connection,
  signature: TransactionSignature,
  commitment: "processed" | "confirmed" | "finalized" = "confirmed",
  timeout: number = 60000, // 60 seconds
): Promise<SignatureStatus> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const { value } = await connection.getSignatureStatus(signature);

    if (value === null) {
      // Transaction not found yet, wait and retry
      await sleep(500);
      continue;
    }

    // Check if there's an error
    if (value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(value.err)}`);
    }

    // Check if we've reached the desired commitment level
    if (
      commitment === "processed" ||
      (commitment === "confirmed" &&
        value.confirmationStatus !== "processed") ||
      (commitment === "finalized" && value.confirmationStatus === "finalized")
    ) {
      return value;
    }

    await sleep(500);
  }

  throw new Error(`Transaction confirmation timeout after ${timeout}ms`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTributary(wallet: WalletContextState): Tributary {
  const connection = new Connection(config.rpcUrl, "processed");
  const anchorWallet: AnchorWallet = {
    publicKey: wallet.publicKey!,
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
  };
  return new Tributary(connection, anchorWallet as unknown as anchor.Wallet);
}

function mapFrequency(
  freq: "daily" | "weekly" | "biweekly" | "monthly",
): PaymentFrequency {
  switch (freq) {
    case "daily":
      return { daily: {} };
    case "weekly":
      return { weekly: {} };
    case "biweekly":
      return { custom: { 0: new BN(14 * 24 * 60 * 60) } };
    case "monthly":
      return { monthly: {} };
    default:
      return { weekly: {} };
  }
}

function usdToBN(usdAmount: number): BN {
  return new BN(Math.floor(usdAmount * 1_000_000));
}

async function getUserPayment(
  wallet: WalletContextState,
): Promise<{ userPayment: UserPayment; pubkey: PublicKey } | null> {
  const tributary = getTributary(wallet);
  const usetPaymentsPda = tributary.getUserPaymentPda(
    wallet.publicKey!,
    new PublicKey(config.usdcMint),
  );
  const userPayment = await tributary.getUserPayment(usetPaymentsPda.address);
  if (userPayment) {
    return {
      userPayment: userPayment,
      pubkey: usetPaymentsPda.address,
    };
  }
  return null;
}

export async function createAllowance(
  params: CreateSubscriptionParams,
): Promise<SubscriptionPolicy> {
  const { parentWallet, childWallet, amountUSD, frequency } = params;
  const tributary = getTributary(parentWallet);

  const amountInSmallestUnits = usdToBN(amountUSD);
  const paymentFrequency = mapFrequency(frequency);
  const tokenMint = new PublicKey(config.usdcMint);
  const gateway = new PublicKey(config.gateway);

  const instructions = await tributary.createSubscription(
    tokenMint,
    childWallet,
    gateway,
    amountInSmallestUnits,
    true,
    null,
    paymentFrequency,
    createMemoBuffer("allowly.app", 64),
    undefined,
    undefined,
    false,
  );

  const transaction = new Transaction().add(...instructions);
  const { blockhash } =
    await tributary.program.provider.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = parentWallet.publicKey!;

  const signedTx = await parentWallet.signTransaction!(transaction);
  const txid = await tributary.program.provider.connection.sendRawTransaction(
    signedTx.serialize(),
  );
  console.log(txid);
  await confirmTransactionWithStatus(tributary.connection, txid, "confirmed");

  const userPayment = await getUserPayment(parentWallet);

  const newPolicyPda = tributary.getPaymentPolicyPda(
    userPayment!.pubkey,
    userPayment!.userPayment.createdPoliciesCount,
  ).address;
  const newPolicy = await tributary.getPaymentPolicy(newPolicyPda);
  if (!newPolicy) {
    throw new Error("Failed to find created policy");
  }

  return {
    id: newPolicy.policyId,
    from: userPayment?.userPayment.owner || parentWallet.publicKey!,
    to: newPolicy.recipient,
    amount: newPolicy.policyType.subscription?.amount || new BN(0),
    frequency: newPolicy.policyType.subscription?.paymentFrequency || {
      weekly: {},
    },
    status: newPolicy.status.active ? "active" : "paused",
    nextPaymentDue:
      newPolicy.policyType.subscription?.nextPaymentDue || new BN(0),
    totalPaid: newPolicy.totalPaid,
    createdAt: newPolicy.createdAt,
  };
}

export async function createPayAsYouGo(
  params: CreatePayAsYouGoParams,
): Promise<PayAsYouGoPolicy> {
  const { humanWallet, agentWallet, maxBudget, maxPerClaim, periodDays } = params;
  const tributary = getTributary(humanWallet);

  const maxAmountPerPeriod = usdToBN(maxBudget);
  const maxChunkAmount = usdToBN(maxPerClaim);
  const periodLength = new BN(periodDays * 24 * 60 * 60);
  const tokenMint = new PublicKey(config.usdcMint);
  const gateway = new PublicKey(config.gateway);

  const instructions = await tributary.createPayAsYouGo(
    tokenMint,
    agentWallet,
    gateway,
    maxAmountPerPeriod,
    maxChunkAmount,
    periodLength,
    createMemoBuffer("allowly.app: agent allowance", 64),
  );

  const transaction = new Transaction().add(...instructions);
  const { blockhash } =
    await tributary.program.provider.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = humanWallet.publicKey!;

  const signedTx = await humanWallet.signTransaction!(transaction);
  const txid = await tributary.program.provider.connection.sendRawTransaction(
    signedTx.serialize(),
  );
  console.log(txid);
  await confirmTransactionWithStatus(tributary.connection, txid, "confirmed");

  const userPayment = await getUserPayment(humanWallet);

  const newPolicyPda = tributary.getPaymentPolicyPda(
    userPayment!.pubkey,
    userPayment!.userPayment.createdPoliciesCount,
  ).address;
  const newPolicy = await tributary.getPaymentPolicy(newPolicyPda);
  if (!newPolicy) {
    throw new Error("Failed to find created policy");
  }

  return {
    id: newPolicy.policyId,
    from: userPayment?.userPayment.owner || humanWallet.publicKey!,
    to: newPolicy.recipient,
    maxAmountPerPeriod:
      newPolicy.policyType.payAsYouGo?.maxAmountPerPeriod || new BN(0),
    maxChunkAmount:
      newPolicy.policyType.payAsYouGo?.maxChunkAmount || new BN(0),
    periodLength:
      newPolicy.policyType.payAsYouGo?.periodLengthSeconds || new BN(0),
    status: newPolicy.status.active ? "active" : "paused",
    totalPaid: newPolicy.totalPaid,
    createdAt: newPolicy.createdAt,
  };
}

export async function getPolicies(
  wallet: WalletContextState,
): Promise<PolicyListResult> {
  const tributary = getTributary(wallet);
  const userPayment = await getUserPayment(wallet);
  const policies = await tributary.getPaymentPoliciesByUser(
    userPayment!.pubkey,
  );
  const subscriptionPolicies: SubscriptionPolicy[] = [];
  const payAsYouGoPolicies: PayAsYouGoPolicy[] = [];

  for (const p of policies) {
    if ("subscription" in p.account.policyType) {
      const owner = userPayment?.userPayment.owner || wallet.publicKey!;
      subscriptionPolicies.push({
        id: p.account.policyId,
        from: owner,
        to: p.account.recipient,
        amount: p.account.policyType.subscription!.amount,
        frequency: p.account.policyType.subscription!.paymentFrequency,
        status: p.account.status.active ? "active" : "paused",
        nextPaymentDue: p.account.policyType.subscription!.nextPaymentDue,
        totalPaid: p.account.totalPaid,
        createdAt: p.account.createdAt,
      });
    } else if ("payAsYouGo" in p.account.policyType) {
      const owner = userPayment?.userPayment.owner || wallet.publicKey!;
      payAsYouGoPolicies.push({
        id: p.account.policyId,
        from: owner,
        to: p.account.recipient,
        maxAmountPerPeriod:
          p.account.policyType.payAsYouGo!.maxAmountPerPeriod || new BN(0),
        maxChunkAmount:
          p.account.policyType.payAsYouGo!.maxChunkAmount || new BN(0),
        periodLength:
          p.account.policyType.payAsYouGo!.periodLengthSeconds || new BN(0),
        status: p.account.status.active ? "active" : "paused",
        totalPaid: p.account.totalPaid,
        createdAt: p.account.createdAt,
      });
    }
  }

  return {
    subscriptions: subscriptionPolicies,
    payAsYouGo: payAsYouGoPolicies,
    userPaymentPubkey: userPayment?.pubkey || null,
  };
}

export async function pausePolicy(
  wallet: WalletContextState,
  policyId: number,
): Promise<void> {
  const tributary = getTributary(wallet);
  const tokenMint = new PublicKey(config.usdcMint);

  const instruction = await tributary.changePaymentPolicyStatus(
    tokenMint,
    policyId,
    { paused: {} },
  );

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await tributary.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey!;

  const signedTx = await wallet.signTransaction!(transaction);
  const txid = await tributary.connection.sendRawTransaction(
    signedTx.serialize(),
  );
  console.log(txid);
  await confirmTransactionWithStatus(tributary.connection, txid, "confirmed");
}

export async function resumePolicy(
  wallet: WalletContextState,
  policyId: number,
): Promise<void> {
  const tributary = getTributary(wallet);
  const tokenMint = new PublicKey(config.usdcMint);

  const instruction = await tributary.changePaymentPolicyStatus(
    tokenMint,
    policyId,
    { active: {} },
  );

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await tributary.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey!;

  const signedTx = await wallet.signTransaction!(transaction);
  const txid = await tributary.connection.sendRawTransaction(
    signedTx.serialize(),
  );
  console.log(txid);
  await confirmTransactionWithStatus(tributary.connection, txid, "confirmed");
}

export async function cancelPolicy(
  wallet: WalletContextState,
  policyId: number,
): Promise<void> {
  const tributary = getTributary(wallet);
  const tokenMint = new PublicKey(config.usdcMint);

  const instruction = await tributary.deletePaymentPolicy(tokenMint, policyId);

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await tributary.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey!;

  const signedTx = await wallet.signTransaction!(transaction);
  const txid = await tributary.connection.sendRawTransaction(
    signedTx.serialize(),
  );
  console.log(txid);
  await confirmTransactionWithStatus(tributary.connection, txid, "confirmed");
}
