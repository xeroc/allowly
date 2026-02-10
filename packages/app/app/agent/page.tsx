"use client";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import AppForm from "@/components/AppForm";
import { useState } from "react";

const skillCode = `# Allowly Agent - Autonomous Pay-As-You-Go Allowances

**Self-contained OpenClow skill for AI agents to check and manage USDC allowance budgets on Solana.**

---

## Overview

Check allowance availability, view pay-as-you-go policy details, and execute payment claims. Humans set up bounded allowance budgets, and you can check your available balance, view policy limits, monitor claim history, and execute claims autonomously.

## Use When

You need to:
- Check how much USDC allowance is available
- View pay-as-you-go policy details set by your human
- Monitor claim history
- Decide when to claim funds within per-claim limits
- Execute payment claims against your allowance policy

## Quick Start

\`\`\`javascript
// Check your allowance status
const status = await checkAllowance();

console.log(\`💰 Total Budget: \${status.totalBudget}\`);
console.log(\`✅ Remaining: \${status.remaining}\`);
console.log(\`⚡ Max per claim: \${status.maxPerClaim}\`);
\`\`\`

---

## API Functions

### checkAllowance(agentWallet)

Check available allowance balance and policy details.

\`\`\`javascript
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

  // Initialize connection
  const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
  });

  try {
    // PRODUCTION IMPLEMENTATION:
    // Fetch from blockchain using Tributary SDK
    // 1. Fetch UserPayment account where recipient = agentWallet
    // 2. Fetch PaymentPolicy accounts for that UserPayment
    // 3. Identify pay-as-you-go policies (not subscriptions)
    // 4. Aggregate totals and calculate remaining
    // 5. Extract maxPerClaim and periodDays from policy

    // MVP IMPLEMENTATION:
    // Return mock data structure matching production

    return {
      totalBudget: 500,
      totalPaid: 45,
      remaining: 455,
      maxPerClaim: 50,
      periodDays: 30,
      periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      policies: [
        {
          id: 1,
          totalBudget: 500,
          maxPerClaim: 50,
          periodDays: 30,
          remaining: 455,
          periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
        },
      ],
    };

  } catch (error) {
    console.error("Error checking allowance:", error.message);
    throw new Error(\`Failed to check allowance: \${error.message}\`);
  }
}
\`\`\`

**Returns:**
\`\`\`javascript
{
  totalBudget: 500,      // Total USDC budget for current period
  totalPaid: 45,          // USDC already claimed in current period
  remaining: 455,          // USDC available to claim
  maxPerClaim: 50,        // Maximum USDC per single claim
  periodDays: 30,         // Period length in days
  periodEnd: "2026-03-12", // Date when budget resets
  policies: [...]          // Array of policy details
}
\`\`\`

### viewPolicy(agentWallet, policyId)

View details of a specific pay-as-you-go policy.

\`\`\`javascript
async function viewPolicy(agentWallet, policyId) {
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  // PRODUCTION: Fetch from blockchain
  // MVP: Return mock data

  return {
    id: policyId,
    totalBudget: 500,
    maxPerClaim: 50,
    periodDays: 30,
    remaining: 455,
    periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  };
}
\`\`\`

### claimHistory(agentWallet, policyId)

View claim/payment history for a policy.

\`\`\`javascript
async function claimHistory(agentWallet, policyId) {
  const connection = new Connection("https://api.mainnet-beta.solana.com");

  // PRODUCTION: Fetch payment transactions from blockchain
  // Use Solana Explorer API or indexer (e.g., Helius)
  // MVP: Return mock data

  return [
    {
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      amount: 10,
      txSignature: "3x..." + policyId,
      memo: "API call: OpenAI",
    },
  ];
}
\`\`\`

### executeClaim(agentWallet, policyPda, claimAmount, recipient, tokenMint, gateway)

Execute a payment claim against a pay-as-you-go policy using Tributary SDK.

\`\`\`javascript
/**
 * Execute a payment claim against a pay-as-you-go policy
 *
 * @param {string} agentWallet - Agent's wallet private key array [num, num, ...]
 * @param {PublicKey} policyPda - Payment policy PDA address (base58 string or PublicKey)
 * @param {number|BN} claimAmount - Amount to claim in smallest token units (e.g., 10000000 for 10 USDC)
 * @param {string} recipient - Recipient public key (base58 string)
 * @param {string} tokenMint - Token mint address (base58 string)
 * @param {string} gateway - Gateway public key (base58 string)
 * @returns {Promise<string>} Transaction signature
 */
async function executeClaim(agentWallet, policyPda, claimAmount, recipient, tokenMint, gateway) {
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
  const policyPdaPubkey = typeof policyPda === 'string' 
    ? new PublicKey(policyPda) 
    : policyPda;
  const recipientPubkey = new PublicKey(recipient);
  const tokenMintPubkey = new PublicKey(tokenMint);
  const gatewayPubkey = new PublicKey(gateway);

  // Convert claim amount to BN if needed
  const amountBN = claimAmount instanceof BN.BN ? claimAmount : new BN.BN(claimAmount);

  try {
    // Execute payment using Tributary SDK
    // This builds the transaction instructions for:
    // 1. Create recipient ATA if needed
    // 2. Create gateway fee ATA if needed
    // 3. Transfer tokens from user to recipient
    // 4. Pay protocol fees
    // 5. Pay gateway fees
    const instructions = await tributary.executePayment(
      policyPdaPubkey,
      amountBN,
      recipientPubkey,
      tokenMintPubkey,
      gatewayPubkey,
      keypair.publicKey // user parameter (caller's wallet)
    );

    // Create and send transaction
    const transaction = new Transaction().add(...instructions);

    // Sign and send transaction
    const signature = await connection.sendTransaction(
      transaction,
      [keypair],
      {
        commitment: "confirmed",
      }
    );

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(
      signature,
      "confirmed"
    );

    if (confirmation.value.err) {
      throw new Error(\`Transaction failed: \${JSON.stringify(confirmation.value.err)}\`);
    }

    console.log(\`✅ Payment claim successful: \${signature}\`);
    console.log(\`💰 Amount claimed: \${claimAmount}\`);

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
      throw new Error(\`Failed to execute claim: \${error.message}\`);
    }
  }
}
\`\`\`

**Parameters:**
- `agentWallet`: Agent's wallet private key as array `[num, num, num, ...]`
- `policyPda`: Payment policy PDA address (base58 string or PublicKey object)
- `claimAmount`: Amount to claim in smallest token units (e.g., 10000000 for 10 USDC)
- `recipient`: Recipient public key (base58 string)
- `tokenMint`: Token mint address (base58 string)
- `gateway`: Gateway public key (base58 string)

**Returns:**
- Transaction signature (base58 string)

**Example:**
\`\`\`javascript
// Execute a claim
const signature = await executeClaim(
  [1,2,3,...,64],  // agent wallet private key array
  "9WzDXw...",         // policy PDA address
  10000000,             // 10 USDC (6 decimals)
  "EPjFWdd5...",        // USDC mint
  "CwNybLVQ..."         // gateway public key
);

console.log(\`Claim signature: \${signature}\`);
\`\`\`

---

## Usage Examples

### Example 1: Check Allowance Before Task

\`\`\`javascript
// Task that requires payment
const task = {
  requiresPayment: true,
  cost: 10,  // USDC
  description: "OpenAI GPT-4"
};

// Check allowance first
const allowance = await checkAllowance(agentWallet);

if (allowance.remaining >= task.cost && task.cost <= allowance.maxPerClaim) {
  console.log(\`✅ Sufficient allowance: \${allowance.remaining}\`);
  console.log(\`✅ Within per-claim limit: max \${allowance.maxPerClaim}\`);
  await executeTask(task);
} else {
  console.log(\`❌ Insufficient allowance. Have \${allowance.remaining}, need \${task.cost}\`);
}
\`\`\`

### Example 2: Smart Claim Sizing

\`\`\`javascript
const tasks = [
  { name: "Send email", cost: 0.50 },
  { name: "API call 1", cost: 2.00 },
  { name: "API call 2", cost: 3.00 },
];

const allowance = await checkAllowance(agentWallet);
const totalCost = tasks.reduce((sum, t) => sum + t.cost, 0);

// Batch claim if within limits
if (totalCost <= allowance.maxPerClaim && totalCost <= allowance.remaining) {
  console.log(\`✅ Batch claim: \${totalCost}\`);
  await executeAllTasks(tasks);
}
\`\`\`

### Example 3: Execute Claim After Checking Allowance

\`\`\`javascript
// Check allowance and execute claim in one flow
const allowance = await checkAllowance(agentWallet);
const claimAmount = 10;  // 10 USDC

if (allowance.remaining >= claimAmount && claimAmount <= allowance.maxPerClaim) {
  // Get policy details from allowance response
  const policy = allowance.policies[0];

  // Execute the claim
  const signature = await executeClaim(
    [1,2,3,...,64],           // agent wallet private key array
    policy.id,                       // policy PDA address
    claimAmount * 1000000,           // convert to smallest units (6 decimals)
    "RECIPIENT_PUBLIC_KEY_HERE",    // where to send funds
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  // USDC mint
    "CwNybLVQ3sVmcZ3Q1veS6x99gUZcAF2duNDe3qbcEMGr"  // gateway
  );

  console.log(\`✅ Claim successful: \${signature}\`);
  console.log(\`💰 Amount: \${claimAmount} USDC\`);
} else {
  console.log(\`❌ Insufficient allowance for \${claimAmount} USDC\`);
}
\`\`\`

---

## Built for Allowly Agent - Autonomous Pay-As-You-Go Allowances
`;

export default function AgentPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(skillCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([skillCode], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "allowly-agent-skill.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      <Hero mode="agent" />
      <HowItWorks mode="agent" />
      <AppForm mode="agent" />
      <Features />

      {/* Skill Download Section */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-4xl">🤖</span>
            Download Agent Skill
          </h2>

          <p className="text-gray-300 mb-6">
            Copy this self-contained OpenClow skill file to give your AI agent
            the ability to check allowance and manage budgets autonomously.
          </p>

          <div className="bg-black/30 rounded-lg border border-white/10 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-mono">
                SKILL.md - Self-contained
              </span>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Download File
              </button>
            </div>

            <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-gray-300">
                {skillCode.substring(0, 500)}...
              </code>
            </pre>

            <button
              onClick={handleCopy}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {copied ? "✅ Copied to clipboard!" : "Copy skill to clipboard"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                ✅ Self-Contained
              </h3>
              <p className="text-sm text-gray-300">
                No external dependencies or imports. Everything you need is in
                this one file.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                🤖 Agent-Ready
              </h3>
              <p className="text-sm text-gray-300">
                OpenClow-compatible skill designed for AI agents to check
                allowances autonomously.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                📊 Budget Tracking
              </h3>
              <p className="text-sm text-gray-300">
                Functions to check remaining budget, max per claim, and period
                end date.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
              <h3 className="text-lg font-semibold text-white mb-2">
                🔄 On-Demand Claims
              </h3>
              <p className="text-sm text-gray-300">
                Agents claim funds when needed, respecting human-set budget
                limits.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-2">
              <strong>Installation:</strong> Save file as{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">
                SKILL.md
              </code>{" "}
              in your OpenClow skills directory.
            </p>
            <p className="text-sm text-gray-400">
              <strong>Documentation:</strong> Full usage guide included in the
              skill file.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
