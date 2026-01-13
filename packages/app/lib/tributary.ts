import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  Tributary,
  PaymentFrequency,
  PaymentPolicy,
  UserPayment,
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

export interface CreateSubscriptionParams {
  parentWallet: WalletContextState;
  childWallet: PublicKey;
  amountUSD: number;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
}

export interface PolicyListResult {
  policies: SubscriptionPolicy[];
  userPaymentPubkey: PublicKey | null;
}

interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

function getTributary(wallet: WalletContextState): Tributary {
  const connection = new Connection(config.rpcUrl);
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
  const userPayments = await tributary.getAllUserPaymentsByOwner(
    wallet.publicKey!,
  );
  if (userPayments.length > 0) {
    return {
      userPayment: userPayments[0]!.account,
      pubkey: userPayments[0]!.publicKey,
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
    [],
    undefined,
    undefined,
    false,
  );

  const transaction = new Transaction().add(...instructions);
  const { blockhash } = await new Connection(
    config.rpcUrl,
  ).getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = parentWallet.publicKey!;

  const signedTx = await parentWallet.signTransaction!(transaction);
  await new Connection(config.rpcUrl).sendRawTransaction(signedTx.serialize());

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const policies = await tributary.getPaymentPoliciesByUser(
    parentWallet.publicKey!,
  );
  const userPayment = await getUserPayment(parentWallet);

  const newPolicy = policies.find(
    (p) =>
      p.account.recipient.toString() === childWallet.toString() &&
      (userPayment
        ? p.account.userPayment.toString() === userPayment.pubkey.toString()
        : true),
  );

  if (!newPolicy) {
    throw new Error("Failed to find created policy");
  }

  return {
    id: newPolicy.account.policyId,
    from: userPayment?.userPayment.owner || parentWallet.publicKey!,
    to: newPolicy.account.recipient,
    amount: newPolicy.account.policyType.subscription?.amount || new BN(0),
    frequency: newPolicy.account.policyType.subscription?.paymentFrequency || {
      weekly: {},
    },
    status: newPolicy.account.status.active ? "active" : "paused",
    nextPaymentDue:
      newPolicy.account.policyType.subscription?.nextPaymentDue || new BN(0),
    totalPaid: newPolicy.account.totalPaid,
    createdAt: newPolicy.account.createdAt,
  };
}

export async function getPolicies(
  wallet: WalletContextState,
): Promise<PolicyListResult> {
  const tributary = getTributary(wallet);
  const userPayment = await getUserPayment(wallet);

  const policies = await tributary.getPaymentPoliciesByUser(wallet.publicKey!);

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
    policies: subscriptionPolicies,
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
  const { blockhash } = await new Connection(
    config.rpcUrl,
  ).getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey!;

  const signedTx = await wallet.signTransaction!(transaction);
  await new Connection(config.rpcUrl).sendRawTransaction(signedTx.serialize());
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
  const { blockhash } = await new Connection(
    config.rpcUrl,
  ).getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey!;

  const signedTx = await wallet.signTransaction!(transaction);
  await new Connection(config.rpcUrl).sendRawTransaction(signedTx.serialize());
}

export async function cancelPolicy(
  wallet: WalletContextState,
  policyId: number,
): Promise<void> {
  const tributary = getTributary(wallet);
  const tokenMint = new PublicKey(config.usdcMint);

  const instruction = await tributary.deletePaymentPolicy(tokenMint, policyId);

  const transaction = new Transaction().add(instruction);
  const { blockhash } = await new Connection(
    config.rpcUrl,
  ).getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey!;

  const signedTx = await wallet.signTransaction!(transaction);
  await new Connection(config.rpcUrl).sendRawTransaction(signedTx.serialize());
}
