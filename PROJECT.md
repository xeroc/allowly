# Allowly - Pocket Money, the web3 way

## Vision

Dead simple recurring allowances using Tributary. Parent wallet → child wallet, automated. No infrastructure, no database, no jobs. Just a clean UI that creates Tributary policies and lets the protocol handle the rest.

---

## Product Concept

**What it is:** A single-page app where parents set up automated USDC allowances for kids using Tributary.

**What it isn't:** Not a SaaS business, not a data platform, not a notification system. Just a tool to create Tributary policies.

**How it works:**

**For Humans (Subscriptions):**
1. Parent connects wallet
2. Enters child's wallet address
3. Sets amount and frequency (e.g., $50/week)
4. Tributary creates a subscription policy
5. Protocol auto-executes payments on schedule
6. Done

**For AI Agents (Pay-as-you-Go):**
1. Human connects wallet
2. Enters agent's wallet address
3. Sets total budget and max per claim (e.g., $500 total, $50/claim, 30 days)
4. Tributary creates a pay-as-you-go policy
5. Agent claims funds on-demand when needed (up to max per claim)
6. Budget depletes until period reset

---

## Technical Stack

```
Frontend: Next.js 15 + React 19 + TypeScript + Tailwind CSS
Protocol: Tributary SDK (@tributary-so/sdk)
Storage: None (everything on-chain or ephemeral)
Deployment: Vercel (static, no edge functions needed)
```

**No backend. No database. No jobs. No cron. No webhooks.**

---

## Architecture

```
┌─────────────────────────────────────┐
│      Next.js Frontend              │
│  (Parent/Agent connects wallet)     │
│  - Enter child/agent wallet address   │
│  - Set amount + frequency/budget     │
│  - Approve token delegation          │
└──────────┬───────────────────────────┘
           │ Tributary SDK
           │ (create PaymentPolicy)
           ▼
    ┌──────────────────┐
    │  Solana Network  │
    │  - USDC transfers │
    │  - On-chain state │
    └──────────────────┘
```

**Data flow:**

1. Parent/Agent wallet signature approves delegation
2. Tributary `PaymentPolicy` (subscription or pay-as-you-go) created on-chain
3. Protocol executes payments automatically (subscriptions) OR agent claims on-demand (pay-as-you-go)
4. Frontend reads on-chain state to show current status

**No server needed.** Everything is client-side SDK calls to Solana.

---

## Core Features (MVP)

### Feature 1: Setup Allowance

**Subscription Model (Kids):**

```typescript
// What happens:
const policy = await tributary.createSubscriptionPolicy({
  from: parentWallet.publicKey,
  to: childWallet.publicKey,
  amount: 50_000_000, // $50 USDC (6 decimals)
  frequency: PaymentFrequency.Weekly,
  autoRenew: true,
});

**Pay-as-you-Go Model (AI Agents):**

```typescript
// What happens:
const policy = await tributary.createPayAsYouGo({
  userPayment: parentWallet.publicKey,
  recipient: agentWallet.publicKey,
  gateway: gatewayPubkey,
  maxAmountPerPeriod: 500_000_000, // $500 total per period
  maxChunkAmount: 50_000_000, // $50 max per claim
  periodLengthSeconds: 30 * 24 * 60 * 60, // 30 days
});
```

**UI:**
- Tab selection: Subscriptions (Kids) or Pay-as-you-Go (AI Agents)
- Input: Child/Agent wallet address
- Input: Amount (USDC)
- Select: Frequency (weekly, bi-weekly, monthly) - for subscriptions
- Input: Total budget, Max per claim, Period length - for pay-as-you-go
- Button: "Create Allowance"
- Success: Policy created, delegation approved

### Feature 2: View Active Policies

```typescript
// What happens:
const policies = await tributary.getUserPaymentPolicies(parentWallet.publicKey);

// User sees:
Table of active policies:
- To: [child/agent_address]
- Amount: $50 or $500 (total budget)
- Frequency: Weekly OR Pay-as-you-Go
- Next payment: [date] or Budget remaining: $455
- Status: Active
```

**UI:**

- List all Tributary policies where user is `from`
- Show payment type (subscription vs pay-as-you-go)
- Show next payment time OR remaining budget
- Show total paid (from `total_amount_paid`)

### Feature 3: Agent Claims (Pay-as-you-Go only)

```typescript
// What happens (agent-initiated):
const claim = await tributary.claimFunds({
  paymentPolicy: policyId,
  amount: amountToClaim, // Up to maxChunkAmount
});

// Agent sees:
("Funds claimed. $10 transferred to wallet.");
```

**UI:**
- Agent uses OpenClaw skill to check allowance
- Shows: Total budget, Remaining, Max per claim, Period end
- Agent triggers claims within bounds
- No approval needed once policy is set

### Feature 4: Pause/Resume/Cancel

```typescript
// What happens:
await tributary.pausePolicy(policyId);
// or
await tributary.resumePolicy(policyId);
// or
await tributary.cancelPolicy(policyId);

// User sees:
("Allowance paused. No payments until you resume.");
```

**UI:**

- Each policy has: Pause | Resume | Cancel buttons
- Cancel requires confirmation

---

## Two Payment Models

### Model 1: Subscriptions (Human-to-Human or Agent-to-Subscription)
- Automatic recurring payments
- Parent/Agent pays on schedule
- Good for: Kids, Subscription-based AI services

### Model 2: Pay-as-you-Go (Human-to-Agent)
- Agent claims funds on-demand
- Budget depletes as claims happen
- Budget resets after period (e.g., monthly)
- Bounded by max per claim (e.g., $50 at once)
- Good for: Autonomous AI agents that need flexibility

---

## Simplified User Flows

### Parent Setup (One-time)

1. Connect wallet (Phantom, Solflare)
2. Click "Create Allowance"
3. Enter child's wallet address
4. Set amount ($10-500/week)
5. Set frequency (weekly/bi-weekly/monthly)
6. Click "Create & Approve"
7. Sign token delegation (one-time)
8. Done

### Human Setup - Pay-as-you-Go Model (One-time)

1. Connect wallet (Phantom, Solflare)
2. Click "Create Agent Allowance" (AI Agents tab)
3. Enter agent's wallet address
4. Set total budget ($50-$10,000)
5. Set max per claim ($5-$500)
6. Set period length (7/30/90 days)
7. Click "Create & Approve"
8. Sign token delegation (one-time)
9. Done

### Agent Usage (Ongoing - Pay-as-you-Go)

1. Check allowance using OpenClaw skill
2. See remaining budget and max per claim
3. Trigger claim when needed (up to max per claim)
4. Receive funds instantly
5. Budget depletes until period reset

---

## Tributary Integration

### Subscription Policy (Weekly Allowance)

```typescript
const policy = await tributary.createPaymentPolicy({
  userPayment: userPaymentPubkey,
  recipient: childWallet.publicKey,
  gateway: gatewayPubkey,
  policyType: {
    subscription: {
      amount: 50_000_000, // $50 USDC
      frequency: PaymentFrequency.Weekly,
      auto_renew: true,
    },
  },
});
```

### Pay-as-you-Go Policy (Agent Budget)

```typescript
const policy = await tributary.createPayAsYouGo({
  userPayment: parentWallet.publicKey,
  recipient: agentWallet.publicKey,
  gateway: gatewayPubkey,
  policyType: {
    payAsYouGo: {
      maxAmountPerPeriod: 500_000_000, // $500 total per period
      maxChunkAmount: 50_000_000, // $50 max per claim
      periodLengthSeconds: 30 * 24 * 60 * 60, // 30 days
    },
  },
});
```

### Pause/Resume

```typescript
await tributary.pausePolicy(policyId);
await tributary.resumePolicy(policyId);
```

### Cancel

```typescript
await tributary.cancelPolicy(policyId);
```

---

## OpenClaw Integration

### Allowly Agent Skill

Located in `/home/clawdbot/clawd/skills/allowly-agent/`

**What it provides:**
- Check allowance status (budget, remaining, max per claim)
- View pay-as-you-go policy details
- View claim history
- Decide when to claim funds

**Functions:**

```typescript
// Check allowance
const status = await checkAllowance(agentWallet);
// Returns: { totalBudget, totalPaid, remaining, maxPerClaim, periodDays, periodEnd, policies }

// View policy details
const policy = await viewPolicy(agentWallet, policyId);
// Returns: { id, totalBudget, maxPerClaim, periodDays, remaining, periodEnd, status }

// View claim history
const history = await claimHistory(agentWallet, policyId);
// Returns: [{ timestamp, amount, txSignature, memo }, ...]
```

**Usage in Agent:**

```typescript
// Example: Agent decides whether to use paid API
const allowance = await checkAllowance(agentWallet);

if (allowance.remaining >= task.cost && task.cost <= allowance.maxPerClaim) {
  await executeTask(task);
} else {
  await notifyHuman("Insufficient allowance");
}
```

---

## Payment Gateway Configuration

**Why you need a gateway:** Tributary requires a `PaymentGateway` to execute payments. The gateway signer calls `execute_payment` on schedule.

**Options:**

### Option A: Run Your Own Gateway (Play project)

```typescript
const gateway = await tributary.createPaymentGateway({
  authority: parentWallet.publicKey,
  feeRecipient: parentWallet.publicKey,
  gatewayFeeBps: 0, // Flat fee set elsewhere
});
```

- You (parent) are the gateway authority
- You manually execute payments OR set up a simple cron job
- **Simpler:** No external dependency
- **Drawback:** Need to trigger payments somehow

### Option B: Use Public Gateway (Recommended)

Find a community Tributary gateway that executes payments for small flat fee.

- Register your gateway with them
- They handle execution
- You pay small flat fee per policy

**For play project:** Start with Option A (self-gateway) for simplicity. Add cron job later if needed.

---

## File Structure

```
packages/app/
├── app/
│   ├── page.tsx              # Landing (redirects to /human)
│   ├── human/
│   │   └── page.tsx         # Subscription model for kids
│   └── agent/
│       └── page.tsx         # Pay-as-you-go model for AI agents
├── components/
│   ├── WalletButton.tsx      # Connect wallet
│   ├── AppForm.tsx           # Legacy form (deprecated)
│   ├── AgentPolicyForm.tsx   # Pay-as-you-go form for agents
│   ├── Hero.tsx              # Landing hero
│   ├── HowItWorks.tsx        # Steps explanation
│   └── Features.tsx           # Feature highlights
├── lib/
│   ├── tributary.ts         # Tributary SDK wrapper
│   └── constants.ts          # Gateway addresses, USDC mint
└── hooks/
    ├── useTributary.ts      # Custom hook for policies
    └── useWallet.ts         # Wallet connection
```

---

## State Management

**No backend = no persistent state.** Use:

1. **On-chain state:** Tributary policies are the source of truth
2. **Ephemeral UI state:** React hooks for form inputs, wallet connection
3. **Optional: LocalStorage** to remember connected wallets

```typescript
// Example: Fetch policies on mount
const { policies, loading } = useTributary(wallet.publicKey);

// UI renders based on live on-chain data
return (
  <div>
    {policies.map((policy) => (
      <PolicyCard key={policy.id} policy={policy} />
    ))}
  </div>
);
```

---

## Routes

- `/` → Landing (redirects to /human)
- `/human` → Subscription allowances for kids
- `/agent` → Pay-as-you-go allowances for AI agents

---

## What We're Building vs Not Building

**We're building:**
- ✅ Subscription allowances with automatic recurring payments
- ✅ Pay-as-you-go allowances with on-demand claims by agents
- ✅ Pause/resume/cancel functionality
- ✅ View active policies and status
- ✅ Agent skill to check and claim allowances
- ✅ Two separate UX flows for different use cases

**We're NOT building (for now):**
- ❌ Complex transaction history (check Solana Explorer)
- ❌ Spending limits beyond per-claim caps
- ❌ Approval workflows for each claim
- ❌ Notification system
- ❌ Analytics/charts
- ❌ Multi-child/agent dashboard
- ❌ Chores/savings features
- ❌ Dark mode

---

## Getting Started

### Prerequisites

```bash
# Tributary SDK
pnpm install @tributary-so/sdk

# Wallet adapter
pnpm install @solana/wallet-adapter-react
```

### Minimal Setup

```typescript
// packages/app/lib/config.ts
export const CONFIG = {
  programId: "TRibg8W8zmPHQqWtyAD1rEBRXEdyU13Mu6qX1Sg42tJ",
  usdcMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC mint
  gateway: new PublicKey("..."), // Your gateway or public gateway
  network: "devnet", // Start on devnet, move to mainnet later
};
```

```typescript
// packages/app/lib/tributary.ts
import { Tributary } from "@tributary-so/sdk";
import { CONFIG } from "./config";

export const tributary = new Tributary({
  programId: CONFIG.programId,
  network: CONFIG.network,
});

// Subscription
export async function createSubscription(
  from: PublicKey,
  to: PublicKey,
  amount: number, // USDC (human readable, e.g., 50)
  frequency: "weekly" | "bi-weekly" | "monthly",
) {
  const policy = await tributary.createPaymentPolicy({
    userPayment: from,
    recipient: to,
    gateway: gatewayPubkey,
    policyType: {
      subscription: {
        amount: amount * 1_000_000,
        frequency: mapFrequency(frequency),
        auto_renew: true,
      },
    },
  });

  return policy;
}

// Pay-as-you-go
export async function createPayAsYouGo(
  from: PublicKey,
  to: PublicKey,
  totalBudget: number,
  maxPerClaim: number,
  periodDays: number,
) {
  const policy = await tributary.createPayAsYouGo({
    userPayment: from,
    recipient: to,
    gateway: gatewayPubkey,
    policyType: {
      payAsYouGo: {
        maxAmountPerPeriod: totalBudget * 1_000_000,
        maxChunkAmount: maxPerClaim * 1_000_000,
        periodLengthSeconds: periodDays * 24 * 60 * 60,
      },
    },
  });

  return policy;
}
```

---

## Deployment

```bash
# Build
pnpm build

# Deploy to Vercel
vercel --prod
```

**Zero infrastructure.** Just a static site.

---

## Future Ideas (If Bored)

1. **Cron job gateway:** Simple script to execute payments every hour
2. **Transaction history:** Pull from Helius API, show simple list
3. **Savings goals:** Child can "lock" portion of allowance
4. **Chore tracking:** Manual task list, parents trigger extra payments
5. **Multi-child/agent view:** Dashboard showing all policies
6. **Dark mode:** Tailwind supports it out of the box
7. **Agent claim gateway:** Web service for agent-initiated claims
8. **Policy analytics:** Track agent spending patterns

---

## Success Criteria (Play Project)

**Functional:**

- ✅ Can create subscription policy (human-to-human)
- ✅ Can create pay-as-you-go policy (human-to-agent)
- ✅ Can view active policies
- ✅ Can pause/resume/cancel
- ✅ Payments execute on schedule (subscriptions)
- ✅ Agent can claim funds on-demand (pay-as-you-go)
- ✅ OpenClaw skill to check allowances

**Simple:**

- ✅ <10 files in core codebase
- ✅ No backend/database
- ✅ Deployed in <1 hour
- ✅ Onboard new parent/agent in <2 minutes

**Fun:**

- ✅ You actually use it with your kids
- ✅ They learn about blockchain payments
- ✅ You understand Tributary better
- ✅ Your AI agent can manage its own budget

---

## Resources

- Tributary SDK: `@tributary-so/sdk`
- Tributary docs: https://tributary.so
- Solana wallet adapter docs: https://solanacookbook.com
- OpenClaw: https://openclaw.ai

