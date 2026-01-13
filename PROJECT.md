# Allowly - Pocket Money, the web3 way

## Vision

Dead simple recurring allowances using Tributary. Parent wallet → child wallet, automated. No infrastructure, no database, no jobs. Just a clean UI that creates Tributary policies and lets the protocol handle the rest.

---

## Product Concept

**What it is:** A single-page app where parents set up automated USDC allowances for kids using Tributary.

**What it isn't:** Not a SaaS business, not a data platform, not a notification system. Just a tool to create Tributary policies.

**How it works:**

1. Parent connects wallet
2. Enters child's wallet address
3. Sets amount and frequency (e.g., $50/week)
4. Tributary creates a subscription policy
5. Protocol auto-executes payments on schedule
6. Done

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
│  (Parent connects wallet)          │
│  - Enter child wallet address      │
│  - Set amount + frequency          │
│  - Approve token delegation        │
└──────────┬──────────────────────────┘
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

1. Parent wallet signature approves delegation
2. Tributary `PaymentPolicy` created on-chain
3. Protocol executes payments automatically based on policy
4. Frontend reads on-chain state to show current status

**No server needed.** Everything is client-side SDK calls to Solana.

---

## Core Features (MVP)

### Feature 1: Setup Allowance

```typescript
// What happens:
const policy = await tributary.createSubscriptionPolicy({
  from: parentWallet.publicKey,
  to: childWallet.publicKey,
  amount: 50_000_000, // $50 USDC (6 decimals)
  frequency: PaymentFrequency.Weekly,
  autoRenew: true,
});

// User sees:
("Allowance created! $50 will transfer to [child_address] every week.");
```

**UI:**

- Input: Child wallet address
- Input: Amount (USDC)
- Select: Frequency (weekly, bi-weekly, monthly)
- Button: "Create Allowance"
- Success: Policy created, delegation approved

### Feature 2: View Active Policies

```typescript
// What happens:
const policies = await tributary.getUserPolicies(parentWallet.publicKey);

// User sees:
Table of active policies:
- To: [child_address]
- Amount: $50
- Frequency: Weekly
- Next payment: [date]
- Status: Active
```

**UI:**

- List all Tributary policies where user is `from`
- Show next payment time (on-chain `next_payment_due`)
- Show total paid (from `total_amount_paid`)

### Feature 3: Pause/Resume/Cancel

```typescript
// What happens:
await tributary.pausePolicy(policyId);
// or
await tributary.cancelPolicy(policyId);

// User sees:
("Allowance paused. No payments until you resume.");
```

**UI:**

- Each policy has: Pause | Resume | Cancel buttons
- Cancel requires confirmation

---

## Simplified User Flow

### Parent Setup (One-time)

1. Connect wallet (Phantom, Solflare)
2. Click "Create Allowance"
3. Enter child's wallet address
4. Set amount ($10-500/week)
5. Set frequency (weekly/bi-weekly/monthly)
6. Click "Create & Approve"
7. Sign token delegation (one-time)
8. Done

That's it. No accounts, no sign-up, no database.

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
apps/pocket-money/
├── app/
│   ├── layout.tsx          # Root layout (wallet provider)
│   ├── page.tsx            # Landing / setup
│   ├── policies/
│   │   └── page.tsx        # View/manage policies
│   └── api/                # (None needed - all client-side)
├── components/
│   ├── WalletButton.tsx    # Connect wallet
│   ├── CreatePolicyForm.tsx # Setup allowance
│   ├── PolicyList.tsx     # Show active policies
│   └── PolicyCard.tsx     # Single policy display
├── lib/
│   ├── tributary.ts       # Tributary SDK wrapper
│   └── config.ts          # Gateway addresses, USDC mint
└── hooks/
    ├── useTributary.ts    # Custom hook for policies
    └── useWallet.ts       # Wallet connection
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

## What We're NOT Building (Deliberately)

**No transaction history:** Too complex for play project. View Solana Explorer directly.

**No spending limits:** Subscription model only. Pay-as-you-go requires more complex policy types.

**No approval workflow:** Keep it simple - allowance = auto-transfer. Parents can pause/cancel if needed.

**No notifications:** Check the app to see status. No emails, no push.

**No analytics:** No charts, no trends. Just raw policy data.

**No multi-child dashboard:** One policy = one view. Create multiple policies if needed.

**No chores/savings:** Just basic allowance. Expand later if fun.

**No merchant categories:** Payments go to child's wallet. They spend how they want.

**No premium tiers:** Free tool. Flat fee on protocol side.

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
// apps/pocket-money/lib/config.ts
export const CONFIG = {
  programId: "TRibg8W8zmPHQqWtyAD1rEBRXEdyU13Mu6qX1Sg42tJ",
  usdcMint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // USDC mint
  gateway: new PublicKey("..."), // Your gateway or public gateway
  network: "devnet", // Start on devnet, move to mainnet later
};
```

```typescript
// apps/pocket-money/lib/tributary.ts
import { Tributary } from "@tributary-so/sdk";
import { CONFIG } from "./config";

export const tributary = new Tributary({
  programId: CONFIG.programId,
  network: CONFIG.network,
});

export async function createAllowance(
  from: PublicKey,
  to: PublicKey,
  amount: number, // USDC (human readable, e.g., 50)
  frequency: "weekly" | "bi-weekly" | "monthly",
) {
  const amountSmallestUnit = amount * 1_000_000; // USDC has 6 decimals

  const policy = await tributary.createSubscriptionPolicy({
    from,
    to,
    amount: amountSmallestUnit,
    frequency: mapFrequency(frequency),
    autoRenew: true,
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
5. **Multi-child view:** Dashboard showing all children's policies
6. **Dark mode:** Tailwind supports it out of the box

---

## Success Criteria (Play Project)

**Functional:**

- Can create allowance policy
- Can view active policies
- Can pause/resume/cancel
- Payments execute on schedule

**Simple:**

- <10 files in codebase
- No backend/database
- Deployed in <1 hour
- Onboard new parent in <2 minutes

**Fun:**

- You actually use it with your kids
- They learn about blockchain payments
- You understand Tributary better

---

## Resources

- Tributary SDK: `sdk/` in monorepo
- Tributary docs: `docs/` in monorepo
- Solana wallet adapter docs: <https://solanacookbook.com>

---

**End.**
