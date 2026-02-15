# Allowly Agent - Autonomous Pay-As-You-Go Allowances

**Self-contained Skill for AI agents to check and manage Allowance budgets on Solana.**

---

## Overview

Check allowance availability, view pay-as-you-go policy details, and execute payment claims. Humans
set up bounded allowance budgets, and you can check your available balance, view policy limits,
monitor claim history, and execute claims autonomously.

## Use When

You need to:

- Check how much USDC allowance is available
- View pay-as-you-go policy details set by your human
- Monitor claim history
- Decide when to claim funds within per-claim limits
- Execute payment claims against your allowance policy

## Quick Start

```javascript
// Check your allowance status
const status = await checkAllowance();

console.log(`💰 Total Budget: ${status.totalBudget}`);
console.log(`✅ Remaining: ${status.remaining}`);
console.log(`⚡ Max per claim: ${status.maxPerClaim}`);
console.log(`⏱️ Period: ${status.periodDays} days`);
console.log(`🔄 Period resets: ${status.periodEnd}`);
```

---

## API Functions

### checkAllowance(agentWallet)

Check available allowance balance and policy details.

```javascript
/**
 * Check allowance status and policy details
 *
 * @param {string} agentWallet - Agent's wallet public key (base58)
 * @returns {Promise<object>} Allowance status with budget, paid, remaining, limits
 */
async function checkAllowance(agentWallet) {
  // Validate inputs
  if (!agentWallet || typeof agentWallet !== "string") {
    throw new Error("Invalid agent wallet address");
  }

  // Import Tributary SDK
  const { Tributary } = await import("@tributary-so/sdk");
  const { Connection, PublicKey, Wallet } = await import("@solana/web3.js");
  const BN = await import("bn.js");

  // Initialize connection
  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  try {
    // 1. Fetch all payment policies where agent is recipient
    const tributary = new Tributary(connection, new Wallet(agentWallet));

    const policies = await tributary.getPaymentPoliciesByRecipient(
      new PublicKey(agentWallet),
    );

    // 2. Filter for active pay-as-you-go policies
    const paygPolicies = policies
      .filter(({ account: policy }) => {
        return (
          policy.status.active !== undefined && // Check if active
          "payAsYouGo" in policy.policyType
        );
      })
      .map(({ publicKey: policyPda, account: policy }) => {
        const payg = policy.policyType.payAsYouGo;

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
          now >= currentPeriodStart &&
          now < currentPeriodStart + periodLengthMs;

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

    // 3. Aggregate totals across all pay-as-you-go policies
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
      periodEnd: paygPolicies.length > 0 ? paygPolicies[0].periodEnd : null,
      policies: paygPolicies,
    };
  } catch (error) {
    console.error("Error checking allowance:", error.message);
    throw new Error(`Failed to check allowance: ${error.message}`);
  }
}

/**
 * Execute a payment claim against a pay-as-you-go policy
 *
 * @param {string} agentWallet - Agent's wallet private key array of numbers
 * @param {PublicKey} policyPda - Payment policy PDA address (base58 string or PublicKey)
 * @param {number|BN} claimAmount - Amount to claim in smallest token units (e.g., 10000000 for 10 USDC)
 * @param {string} recipient - Recipient public key (base58 string)
 * @param {string} tokenMint - Token mint address (base58 string)
 * @param {string} gateway - Gateway public key (base58 string)
 * @returns {Promise<string>} Transaction signature
 */
async function executeClaim(
  agentWallet,
  policyPda,
  claimAmount,
  recipient,
  tokenMint,
  gateway,
) {
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

  // Import Tributary SDK
  const { Tributary } = await import("@tributary-so/sdk");
  const { Connection, PublicKey, Keypair } = await import("@solana/web3.js");
  const BN = await import("bn.js");

  // Initialize connection
  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  // Create Keypair from private key array
  const keypair = Keypair.fromSecretKey(Uint8Array(agentWallet));

  // Create Tributary SDK instance
  const tributary = new Tributary(connection, keypair);

  // Convert parameters to PublicKey if needed
  const policyPdaPubkey =
    typeof policyPda === "string" ? new PublicKey(policyPda) : policyPda;
  const recipientPubkey = new PublicKey(recipient);
  const tokenMintPubkey = new PublicKey(tokenMint);
  const gatewayPubkey = new PublicKey(gateway);

  // Convert claim amount to BN if needed
  const amountBN =
    claimAmount instanceof BN.BN ? claimAmount : new BN.BN(claimAmount);

  try {
    // Execute payment using Tributary SDK
    const instructions = await tributary.executePayment(
      policyPdaPubkey,
      amountBN,
      recipientPubkey,
      tokenMintPubkey,
      gatewayPubkey,
      keypair.publicKey, // user parameter (caller's wallet)
    );

    // Create and send transaction
    const transaction = new Transaction().add(...instructions);

    // Sign and send transaction
    const signature = await connection.sendTransaction(transaction, [keypair], {
      commitment: "confirmed",
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

```javascript
// Execute a claim
const signature = await executeClaim(
  [1, 2, 3, ..., 64],                              // agent wallet private key array
  policy.id,                                       // policy PDA address
  claimAmount * 1000000,                           // convert to smallest units (6 decimals)
  "RECIPIENT_PUBLIC_KEY_HERE",                     // where to send funds
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  // USDC mint
  "CwNybLVQ3sVmcZ3Q1veS6x99gUZcAF2duNDe3qbcEMGr"   // gateway
  );

console.log(`Claim signature: ${signature}`);
```

---

## Usage Examples

### Example 1: Check Allowance Before Task

```javascript
// Task that requires payment
const task = {
  requiresPayment: true,
  cost: 10, // USDC
  description: "OpenAI GPT-4",
};

// Check allowance first
const allowance = await checkAllowance(agentWallet);

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

```javascript
const tasks = [
  { name: "Send email", cost: 0.5 },
  { name: "API call 1", cost: 2.0 },
  { name: "API call 2", cost: 3.0 },
];

const allowance = await checkAllowance(agentWallet);
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

```javascript
// Check allowance and execute claim in one flow
const allowance = await checkAllowance(agentWallet);
const claimAmount = 10;  // 10 USDC

if (allowance.remaining >= claimAmount && claimAmount <= allowance.maxPerClaim) {
  // Get policy details from allowance response (use first active policy)
  const policy = allowance.policies.find(p => p.status === "active");

  if (!policy) {
    throw new Error("No active pay-as-you-go policy found");
  }

  // Execute a claim
  const signature = await executeClaim(
    [1,2,3,...,64],                                  // agent wallet private key array
    policy.id,                                       // policy PDA address
    claimAmount * 1000000,                           // convert to smallest units (6 decimals)
    "RECIPIENT_PUBLIC_KEY_HERE",                     // where to send funds
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  // USDC mint
    "CwNybLVQ3sVmcZ3Q1veS6x99gUZcAF2duNDe3qbcEMGr"   // gateway
    );

  console.log(`✅ Claim successful: ${signature}`);
  console.log(`💰 Amount: ${claimAmount} USDC`);
  console.log(`🔄 Remaining budget: ${allowance.remaining - claimAmount} USDC`);
} else {
  console.log(`❌ Insufficient allowance for ${claimAmount} USDC`);
  console.log(`💰 Have: ${allowance.remaining}, Need: ${claimAmount}`);
}
```
