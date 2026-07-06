import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  Tributary,
  PaymentFrequency,
  UserPayment,
  createMemoBuffer,
  IWallet,
} from "@tributary-so/sdk";
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
  maxBudget: number; // Max USDC per period (e.g., €500)
  maxPerClaim: number; // Max per single claim (e.g., €50)
  periodDays: number; // Period length in days (e.g., 30 days)
}

export interface PolicyListResult {
  subscriptions: SubscriptionPolicy[];
  userPaymentPubkey: PublicKey | null;
}

interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

async function sendTx(
  wallet: WalletContextState,
  instructions: TransactionInstruction[] | TransactionInstruction,
  connection: Connection,
): Promise<void> {
  const tx = new Transaction().add(
    ...(Array.isArray(instructions) ? instructions : [instructions]),
  );
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey!;
  const signed = await wallet.signTransaction!(tx);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "confirmed");
}

function getTributary(wallet: WalletContextState): Tributary {
  const connection = new Connection(config.rpcUrl, "processed");
  const anchorWallet: AnchorWallet = {
    publicKey: wallet.publicKey!,
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
  };
  return new Tributary(connection, anchorWallet as IWallet);
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

  await sendTx(parentWallet, instructions, tributary.connection);

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
  const { humanWallet, agentWallet, maxBudget, maxPerClaim, periodDays } =
    params;
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

  await sendTx(humanWallet, instructions, tributary.connection);

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
  if (!userPayment) {
    return { subscriptions: [], userPaymentPubkey: null };
  }
  const policies = await tributary.getPaymentPoliciesByUser(userPayment.pubkey);
  const subscriptionPolicies: SubscriptionPolicy[] = [];

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
    }
  }

  return {
    subscriptions: subscriptionPolicies,
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

  await sendTx(wallet, instruction, tributary.connection);
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

  await sendTx(wallet, instruction, tributary.connection);
}

export async function cancelPolicy(
  wallet: WalletContextState,
  policyId: number,
): Promise<void> {
  const tributary = getTributary(wallet);
  const tokenMint = new PublicKey(config.usdcMint);

  const instruction = await tributary.deletePaymentPolicy(tokenMint, policyId);

  await sendTx(wallet, instruction, tributary.connection);
}
