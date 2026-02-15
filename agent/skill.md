---
name: allowly-agent
description: Claim USDC from an allowance using TypeScript/tsx
---
# Allowly Agent - Autonomous Pay-As-You-Go Allowances

**Self-contained TypeScript Skill for AI agents to check and manage Allowance budgets on Solana.**

---

## Overview

Check allowance availability, view pay-as-you-go policy details, and execute payment claims. Humans
set up bounded allowance budgets, and you can check your available balance, view policy limits,
monitor claim history, and execute claims autonomously.

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js with tsx (TypeScript executor)
- **SDK**: @tributary-so/sdk (RecurringPaymentsSDK)
- **Blockchain**: Solana mainnet

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Agent Wallet

```bash
npm run create-wallet
```

This creates `agent-wallet.json` with your agent's keypair.

### 3. Create Payment Policy (Human Task)

Your human must create a pay-as-you-go payment policy on allowly.app/agent.

## Use When

You need to:

- Check how much USDC allowance is available
- View pay-as-you-go policy details set by your human
- Monitor claim history
- Decide when to claim funds within per-claim limits
- Execute payment claims against your allowance policy

## Quick Start

```typescript
import { checkAllowance } from "./index.js";

// Check your allowance status
const status = await checkAllowance(agentWalletPublicKey);

console.log(`💰 Total Budget: ${status.totalBudget}`);
console.log(`✅ Remaining: ${status.remaining}`);
console.log(`⚡ Max per claim: ${status.maxPerClaim}`);
console.log(`⏱️ Period: ${status.periodDays} days`);
console.log(`🔄 Period resets: ${status.periodEnd}`);
```

---

## API Functions

### checkAllowance(agentWallet: string): Promise<AllowanceStatus>

Check available allowance balance and policy details.

```typescript
/**
 * Check allowance status and policy details
 *
 * @param agentWallet - Agent's wallet public key (base58)
 * @returns Allowance status with budget, paid, remaining, limits
 */
async function checkAllowance(agentWallet: string): Promise<AllowanceStatus> {
  // Validate inputs
  if (!agentWallet || typeof agentWallet !== "string") {
    throw new Error("Invalid agent wallet address");
  }

  // Import Tributary SDK dynamically (resolves module issues)
  const sdkPath =
    process.cwd() + "/node_modules/@tributary-so/sdk/dist/sdk/src/index.js";
  const tributaryModule = await import(sdkPath);
  const RecurringPaymentsSDK = tributaryModule.RecurringPaymentsSDK;

  // Initialize connection
  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  // Create SDK instance
  const tributary = new RecurringPaymentsSDK(connection, {
    publicKey: new PublicKey(agentWallet),
    signTransaction: async (tx) => tx,
    signAllTransactions: async (txs) => txs,
  });

  // Fetch payment policies for user
  const policies = await tributary.getPaymentPoliciesByUser(
    new PublicKey(agentWallet),
  );

  // Filter for active pay-as-you-go policies
  const paygPolicies: PolicyInfo[] = policies
    .filter(({ account: policy }) => {
      return (
        "status" in policy &&
        policy.status.active !== undefined &&
        "policyType" in policy &&
        "payAsYouGo" in policy.policyType
      );
    })
    .map(({ publicKey: policyPda, account: policy }) => {
      const payg = policy.policyType.payAsYouGo!;

      // Convert from smallest units to human-readable (e.g., USDC has 6 decimals)
      const decimals = 6; // USDC standard
      const maxAmountPerPeriod =
        Number(payg.maxAmountPerPeriod) / 10 ** decimals;
      const maxChunkAmount = Number(payg.maxChunkAmount) / 10 ** decimals;
      const periodTotal = Number(payg.currentPeriodTotal) / 10 ** decimals;

      // Calculate period end time
      const currentPeriodStart = Number(payg.currentPeriodStart) * 1000; // Unix to ms
      const periodLengthMs = Number(payg.periodLengthSeconds) * 1000;
      const periodEnd = new Date(currentPeriodStart + periodLengthMs);

      // Calculate remaining in period
      const remaining = Math.max(0, maxAmountPerPeriod - periodTotal);

      // Check if period has expired
      const now = Date.now();
      const isPeriodActive =
        now >= currentPeriodStart && now < currentPeriodStart + periodLengthMs;

      return {
        id: policyPda.toString(),
        totalBudget: maxAmountPerPeriod,
        maxPerClaim: maxChunkAmount,
        periodSeconds: Number(payg.periodLengthSeconds),
        periodStart: new Date(currentPeriodStart).toISOString(),
        periodEnd: periodEnd.toISOString(),
        currentPeriodTotal: periodTotal,
        remaining: isPeriodActive ? remaining : maxAmountPerPeriod,
        status: policy.status.active !== undefined ? "active" : "paused",
      };
    });

  if (paygPolicies.length === 0) {
    throw new Error("No active pay-as-you-go policies found for this wallet");
  }

  // Aggregate totals across all pay-as-you-go policies
  const totalBudget = paygPolicies.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalPaid = paygPolicies.reduce(
    (sum, p) => sum + p.currentPeriodTotal,
    0,
  );
  const remaining = paygPolicies.reduce((sum, p) => sum + p.remaining, 0);
  const maxPerClaim = Math.max(...paygPolicies.map((p) => p.maxPerClaim));
  const periodSeconds = Math.max(...paygPolicies.map((p) => p.periodSeconds));

  return {
    totalBudget,
    totalPaid,
    remaining,
    maxPerClaim,
    periodSeconds,
    periodDays: Math.round(periodSeconds / 86400), // Convert to days
    periodEnd: paygPolicies[0].periodEnd,
    policies: paygPolicies,
  };
}
```

### executeClaim(agentWallet, policyPda, claimAmount, recipient, tokenMint, gateway): Promise<string>

Execute a payment claim against a pay-as-you-go policy.

```typescript
/**
 * Execute a payment claim against a pay-as-you-go policy
 *
 * @param agentWallet - Agent's wallet private key array of numbers
 * @param policyPda - Payment policy PDA address (base58 string or PublicKey)
 * @param claimAmount - Amount to claim in smallest token units (e.g., 10000000 for 10 USDC)
 * @param recipient - Recipient public key (base58 string)
 * @param tokenMint - Token mint address (base58 string)
 * @param gateway - Gateway public key (base58 string)
 * @returns Transaction signature
 */
async function executeClaim(
  agentWallet: number[],
  policyPda: string | PublicKey,
  claimAmount: number | BN,
  recipient: string,
  tokenMint: string,
  gateway: string,
): Promise<string> {
  // Validate inputs
  if (!agentWallet || !Array.isArray(agentWallet)) {
    throw new Error("Invalid agent wallet keypair array");
  }
  if (!policyPda) {
    throw new Error("Policy PDA address is required");
  }
  if (!claimAmount || claimAmount <= 0) {
    throw new Error("Claim amount must be greater than 0");
  }

  // Import Tributary SDK dynamically
  const sdkPath =
    process.cwd() + "/node_modules/@tributary-so/sdk/dist/sdk/src/index.js";
  const tributaryModule = await import(sdkPath);
  const RecurringPaymentsSDK = tributaryModule.RecurringPaymentsSDK;

  // Initialize connection
  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  // Create Keypair from private key array
  const keypair = Keypair.fromSecretKey(new Uint8Array(agentWallet));

  // Create Tributary SDK instance
  const tributary = new RecurringPaymentsSDK(connection, keypair);

  // Convert parameters to PublicKey if needed
  const policyPdaPubkey =
    typeof policyPda === "string" ? new PublicKey(policyPda) : policyPda;
  const recipientPubkey = new PublicKey(recipient);
  const tokenMintPubkey = new PublicKey(tokenMint);
  const gatewayPubkey = new PublicKey(gateway);

  // Convert claim amount to BN if needed
  const amountBN =
    claimAmount instanceof BN ? claimAmount : new BN(claimAmount);

  try {
    // Execute payment using Tributary SDK
    const instructions = await tributary.executePayment(
      policyPdaPubkey,
      recipientPubkey,
      tokenMintPubkey,
      gatewayPubkey,
      keypair.publicKey,
    );

    // Create and send transaction
    const transaction = new Transaction().add(...instructions);

    // Sign and send transaction
    const signature = await connection.sendTransaction(transaction, [keypair], {
      maxRetries: 3,
    });

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(
      signature,
      "confirmed",
    );

    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
      );
    }

    console.log(`✅ Payment claim successful: ${signature}`);
    console.log(`💰 Amount claimed: ${claimAmount}`);

    return signature;
  } catch (error) {
    console.error("❌ Payment claim failed:", error);

    // Handle common errors
    if (error.message.includes("insufficient")) {
      throw new Error("Insufficient token balance for this claim");
    } else if (error.message.includes("exceeded")) {
      throw new Error("Claim amount exceeds max per claim limit");
    } else if (error.message.includes("period")) {
      throw new Error("Payment period has not started or has ended");
    } else {
      throw new Error(`Failed to execute claim: ${error.message}`);
    }
  }
}
```

**Parameters:**

- `agentWallet`: Agent's wallet private key as array of numbers
- `policyPda`: Payment policy PDA address (base58 string or PublicKey object)
- `claimAmount`: Amount to claim in smallest token units (e.g., 10000000 for 10 USDC)
- `recipient`: Recipient public key (base58 string)
- `tokenMint`: Token mint address (base58 string)
- `gateway`: Gateway public key (base58 string)

**Returns:**

- Transaction signature (base58 string)

**Example:**

```typescript
// Execute a claim
import { executeClaim } from "./index.js";
import fs from "fs";

const secretKey = JSON.parse(fs.readFileSync("agent-wallet.json", "utf-8"));
const { Keypair } = await import("@solana/web3.js");
const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

const signature = await executeClaim(
  [...keypair.secretKey], // agent wallet private key array
  policy.id, // policy PDA address
  claimAmount * 1000000, // convert to smallest units (6 decimals)
  "RECIPIENT_PUBLIC_KEY_HERE", // where to send funds
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint
  "CwNybLVQ3sVmcZ3Q1veS6x99gUZcAF2duNDe3qbcEMGr", // gateway
);

console.log(`Claim signature: ${signature}`);
```

---

## Usage Examples

### Example 1: Check Allowance Before Task

```typescript
// Task that requires payment
const task = {
  requiresPayment: true,
  cost: 10, // USDC
  description: "OpenAI GPT-4",
};

// Check allowance first
const allowance = await checkAllowance(agentWalletPublicKey);

if (allowance.remaining >= task.cost && task.cost <= allowance.maxPerClaim) {
  console.log(`✅ Sufficient allowance: ${allowance.remaining}`);
  console.log(`✅ Within per-claim limit: max ${allowance.maxPerClaim}`);
  console.log(`⏱️ Period resets in: ${allowance.periodEnd}`);
  await executeTask(task);
} else {
  console.log(
    `❌ Insufficient allowance. Have ${allowance.remaining}, need ${task.cost}`,
  );
}
```

### Example 2: Smart Claim Sizing

```typescript
const tasks = [
  { name: "Send email", cost: 0.5 },
  { name: "API call 1", cost: 2.0 },
  { name: "API call 2", cost: 3.0 },
];

const allowance = await checkAllowance(agentWalletPublicKey);
const totalCost = tasks.reduce((sum, t) => sum + t.cost, 0);

// Batch claim if within per-claim and total remaining limits
if (totalCost <= allowance.maxPerClaim && totalCost <= allowance.remaining) {
  console.log(`✅ Batch claim: ${totalCost} USDC`);
  console.log(`⏱️ Period: ${allowance.periodDays} days`);
  await executeAllTasks(tasks);
} else {
  console.log(`❌ Batch exceeds limits`);
  console.log(`💰 Per-claim max: ${allowance.maxPerClaim}`);
  console.log(`💰 Total remaining: ${allowance.remaining}`);
}
```

### Example 3: Execute Claim After Checking Allowance

```typescript
// Check allowance and execute claim in one flow
const allowance = await checkAllowance(agentWalletPublicKey);
const claimAmount = 10; // 10 USDC

if (
  allowance.remaining >= claimAmount &&
  claimAmount <= allowance.maxPerClaim
) {
  // Get policy details from allowance response (use first active policy)
  const policy = allowance.policies.find((p) => p.status === "active");

  if (!policy) {
    throw new Error("No active pay-as-you-go policy found");
  }

  // Load wallet and execute claim
  const secretKey = JSON.parse(fs.readFileSync("agent-wallet.json", "utf-8"));
  const { Keypair } = await import("@solana/web3.js");
  const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

  const signature = await executeClaim(
    [...keypair.secretKey], // agent wallet private key array
    policy.id, // policy PDA address
    claimAmount * 1000000, // convert to smallest units (6 decimals)
    "RECIPIENT_PUBLIC_KEY_HERE", // where to send funds
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint
    "CwNybLVQ3sVmcZ3Q1veS6x99gUZcAF2duNDe3qbcEMGr", // gateway
  );

  console.log(`✅ Claim successful: ${signature}`);
  console.log(`💰 Amount: ${claimAmount} USDC`);
  console.log(`🔄 Remaining budget: ${allowance.remaining - claimAmount} USDC`);
} else {
  console.log(`❌ Insufficient allowance for ${claimAmount} USDC`);
  console.log(`💰 Have: ${allowance.remaining}, Need: ${claimAmount}`);
}
```

---

## Available Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `npm run create-wallet`   | Generate new agent wallet         |
| `npm run check-allowance` | Check available allowance balance |
| `npm run claim-10`        | Claim 10 USDC from allowance      |

## TypeScript Configuration

The project uses `tsx` to run TypeScript files directly with proper module resolution. The `tsconfig.json` includes:

- `"moduleResolution": "bundler"` for ES module compatibility
- `"module": "ESNext"` for modern module syntax
- `"esModuleInterop": true` for SDK compatibility
- Dynamic SDK imports to avoid module resolution issues

---

## Troubleshooting

### "No active pay-as-you-go policies found"

Your human hasn't created a payment policy yet. They need to:

1. Install Tributary CLI: `npm install -g @tributary-so/cli`
2. Create a policy with your wallet as recipient
3. Provide you with the policy PDA address and gateway

### SDK Import Errors

The project uses dynamic imports to resolve Tributary SDK module issues. Ensure all dependencies are installed:

```bash
npm install
```

### Transaction Failed

Check:

- Policy has sufficient remaining balance
- Claim amount is within per-claim limit
- Agent wallet has SOL for transaction fees (~0.0005 SOL)
- Gateway is authorized for the policy

