# CONTEXT — Allowly

> Read this before touching anything. Explains what the repo _is_, not how to
> build it (see `AGENTS.md` for commands).

## One-liner

**Allowly** is a static Next.js app that lets a human create Tributary payment
policies on Solana — recurring **subscriptions** (parent → child allowance) or
**pay-as-you-go** budgets (human → AI agent). No backend, no database: every
write goes through the Tributary SDK to an on-chain program.

It is a **consumer** of `@tributary-so/sdk`. The protocol itself (Rust/Anchor
program, SDK source, formal verification) lives in a sibling repo symlinked at
`./tributary` → `../tributary`. Allowly never edits the protocol.

---

## The two products

| Route    | Mode  | What it does                                              |
| -------- | ----- | --------------------------------------------------------- |
| `/human` | Human | Subscription allowance: `$X` every week/biweekly/monthly. |
| `/agent` | Agent | Pay-as-you-go budget: total + max-per-claim + period.     |

`/` is a **mode selector** landing page — two cards, links into each route.
It is **not** a redirect (PROJECT.md is outdated here).

Both modes:

1. Connect Solana wallet (Phantom/Solflare via wallet adapter).
2. Fill a form (recipient address + params).
3. Sign one tx → Tributary `PaymentPolicy` created on-chain.
4. Protocol executes payments; Allowly just reads state back.

---

## Architecture in one diagram

```
┌──────────────────────────────────────────────────────────────┐
│ Browser (static HTML/JS from GitHub Pages)                   │
│                                                              │
│  React 19 + Next 15 app (output: "export")                   │
│   ┌──────────────┐    ┌──────────────────────────────────┐   │
│   │ Wallet       │    │ packages/app/lib/tributary.ts    │   │
│   │ Adapter      │◄──►│  ← only place SDK is imported   │   │
│   │ (Phantom)    │    │  createAllowance / createPayAs   │   │
│   └──────────────┘    │  YouGo / getPolicies / pause /   │   │
│                       │  resume / cancel                 │   │
│                       └──────────────┬───────────────────┘   │
└──────────────────────────────────────┼───────────────────────┘
                                       │ @tributary-so/sdk
                                       │ (Anchor client)
                                       ▼
                       ┌───────────────────────────────┐
                       │ Solana mainnet                │
                       │  • Tributary program          │
                       │  • USDC mint (hardcoded)      │
                       │  • PaymentGateway (hardcoded) │
                       └───────────────────────────────┘
```

**Data flow**: form → `lib/tributary.ts` builds the tx → wallet signs →
Solana → on-chain `PaymentPolicy`. Reads are the same path in reverse:
`getPolicies` pulls on-chain accounts and maps them to the two TS interfaces.

---

## Where things live (the 5 files that matter)

| File                                 | Why it matters                                              |
| ------------------------------------ | ----------------------------------------------------------- |
| `packages/app/lib/tributary.ts`      | **Integration boundary.** Every SDK call goes through here. |
| `packages/app/constants.ts`          | RPC URL, program ID, USDC mint, gateway. Env-overridable.   |
| `packages/app/app/page.tsx`          | Mode selector landing page (the root).                      |
| `packages/app/app/{human,agent}/`    | The two product routes.                                     |
| `packages/app/public/agent/skill.md` | Self-contained agent skill, served as static asset.         |

Everything else is presentation: `components/` (forms, hero, policy cards),
`lib/animations.ts` (framer-motion variants), `tailwind.config.ts` (theme).

---

## The two policy types, concretely

**Subscription** (`createAllowance`, human mode):

- Params: recipient, amount USD, frequency (daily/weekly/biweekly/monthly).
- On-chain: `policyType.subscription { amount, paymentFrequency, nextPaymentDue }`.
- Gateway executes on schedule; allowance renews until paused/cancelled.

**Pay-as-you-go** (`createPayAsYouGo`, agent mode):

- Params: recipient, max budget per period, max per single claim, period days.
- On-chain: `policyType.payAsYouGo { maxAmountPerPeriod, maxChunkAmount, periodLengthSeconds }`.
- Agent claims on-demand up to `maxChunkAmount`; budget depletes until period reset.

USD inputs are human-readable; `usdToBN()` multiplies by `1_000_000` (USDC has
6 decimals) before sending to the program.

---

## External dependencies that shape the build

- **`@tributary-so/sdk`** — the protocol client. Everything Allowly does on
  Solana flows through it. Pinned `^1.13.0`.
- **`@coral-xyz/anchor`** — leaks Node deps (`pino-pretty`, `encoding`) into
  the browser bundle. `next.config.js` externalizes them and stubs
  `fs`/`net`/`tls`. Do not remove those fallbacks without testing the build.
- **`@solana/wallet-adapter-*`** — wallet connection. Wrapped in
  `components/WalletProvider.tsx`, mounted in `layout.tsx`.
- **framer-motion** — all animation. Variants live in `lib/animations.ts`.

No backend deps. No database. No queue. Static export only.

---

## Deployment

Push to `main` → `.github/workflows/deploy-pages.yml` runs:
`pnpm install` → `pnpm --filter allowly-landingpage build` →
`peaceiris/actions-gh-pages` publishes `packages/app/out/` to the
`allowly.app` CNAME on GitHub Pages.

Secrets the workflow expects: `NEXT_PUBLIC_SOLANA_RPC_URL`,
`NEXT_PUBLIC_ACTIONCODES_AUTH_TOKEN`. Everything else is hardcoded in
`constants.ts` (mainnet, USDC, gateway, program ID).

---

## What this repo is _not_

- ❌ Not the Tributary protocol (that's `../tributary`).
- ❌ Not a SaaS — no server, no users table, no auth beyond the wallet.
- ❌ Not multi-tenant — policies live on-chain, keyed by the payer's wallet.
- ❌ Not tested — there is no test suite. Verify by building and using a
  burner wallet on mainnet (or temporarily pointing `constants.ts` at devnet).

When in doubt, read `lib/tributary.ts` — it is the source of truth for what
the app can actually do.
