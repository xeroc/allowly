# Agent Guide — Allowly

Allowly is a **static Next.js app** that creates Tributary payment policies on
Solana. It is a _consumer_ of `@tributary-so/sdk`, not the protocol itself.
The protocol repo lives at `../tributary` (symlinked as `./tributary`).

> Read `CONTEXT.md` first if you're new here. It explains what the repo is.

---

## Commands

All commands run from `packages/app/` unless noted. Root has no real scripts.

```bash
pnpm install                 # root, installs workspace
pnpm --filter allowly-landingpage dev      # dev server (port 3000)
pnpm --filter allowly-landingpage build    # static export → packages/app/out/
pnpm --filter allowly-landingpage lint     # next lint

# Remotion (marketing video, separate package)
pnpm --filter remotion dev                 # remotion studio
pnpm --filter remotion build               # bundle
```

Deployment is **GitHub Actions** on push to `main` → GitHub Pages, CNAME
`allowly.app`. See `.github/workflows/deploy-pages.yml`. Not Vercel.

No tests. No typecheck script — `tsc` runs via `next lint` and the Next plugin.

---

## Repo Layout

```
packages/
├── app/                      # The product. Next.js 15, static export.
│   ├── app/                  # App-router pages
│   │   ├── page.tsx          # Mode selector (root) — NOT a redirect
│   │   ├── human/page.tsx    # Subscription allowances (kids/family)
│   │   ├── agent/page.tsx    # Pay-as-you-go + skill download
│   │   └── layout.tsx        # Providers, metadata, analytics
│   ├── components/           # UI: forms, hero, policy cards, wallet
│   ├── lib/
│   │   ├── tributary.ts      # ← THE integration boundary. All SDK calls.
│   │   └── animations.ts     # framer-motion variants
│   ├── constants.ts          # RPC, programId, USDC mint, gateway (env-overridable)
│   └── public/               # Static assets incl. /agent/skill.md
└── remotion/                 # Marketing video project. Separate build, Tailwind v4.
```

`.hive/` holds issue/memory JSONL — local tracker, not part of the build.
`.beans/` holds the bean issue tracker (`beans list`, `beans show <id>`). Bean
files are markdown, safe to edit. Run `beans prime` at session start.
`tributary` → symlink to `../tributary` (protocol source, for cross-reference).

---

## Conventions

- **Commits**: `pre-commit` runs commitizen + `cz-conventional-gitmoji`.
  Conventional commits with gitmoji prefix. No plain `fix:` messages.
- **Styling**: Tailwind v3 in `app/`, custom theme in `tailwind.config.ts`
  (dark-first, `primary` / `accent` / `surface` / `muted` scales). Fonts:
  Clash Display, General Sans, JetBrains Mono.
- **TypeScript**: strict. Path alias `@/*` → package root.
- **No backend, no API routes, no server actions.** `next.config.js` sets
  `output: "export"` — everything ships as static HTML/JS to GitHub Pages.
- **Client-only SDK calls.** Every Tributary call needs a connected wallet;
  pages are `"use client"`.

---

## Tributary Integration

All SDK access funnels through `packages/app/lib/tributary.ts`. If you need a
new protocol operation, add it there — do **not** import `@tributary-so/sdk`
directly from components. Existing wrappers:

- `createAllowance` — subscription policy (human mode)
- `createPayAsYouGo` — bounded budget policy (agent mode)
- `getPolicies` — lists both types for a connected wallet
- `pausePolicy` / `resumePolicy` / `cancelPolicy`

Each wrapper builds the tx, signs via the wallet adapter, sends, and polls
confirmation (custom `confirmTransactionWithStatus`, 60s timeout — pending
removal, see `allowly-XXXX` ponytail-cleanup epic). USDC amounts are
human-readable USD in the form API; multiplied by `1_000_000` internally.

**Network defaults are mainnet** (see `constants.ts`). Override per-env with
`NEXT_PUBLIC_SOLANA_RPC_URL`, `NEXT_PUBLIC_TRIBUTARY_PROGRAM_ID`,
`NEXT_PUBLIC_USDC_MINT`, `NEXT_PUBLIC_GATEWAY_ADDRESS`. Gateway and USDC mint
are hardcoded to production values.

---

## The Allowly-Agent Skill

A self-contained skill file shipped as a static asset at `/agent/skill.md`
(served from `packages/app/public/agent/skill.md`). The `/agent` page renders
it with `react-markdown` and offers copy/download buttons. An installed copy
also lives in the opencode skills dir (`allowly-agent`).

When you change the skill markdown, update **both** the public asset and any
installed copy — they are not linked.

---

## Gotchas

- **Webpack fallbacks.** `next.config.js` adds `fs/net/tls: false` and
  externals for `pino-pretty`/`encoding`. These Node deps leak in from Anchor
  and must be excluded from the browser bundle. Don't remove without testing
  the build.
- **Static export = no dynamic routes, no middleware, no image optimization.**
  `images.unoptimized: true` is required, not optional.
- **Wallet adapter.** `SolanaWalletProvider` wraps the app in `layout.tsx`.
  Any component using `useWallet()` must be inside it — all pages are.
- **Two Tailwind versions.** `packages/app` is Tailwind v3 (config file),
  `packages/remotion` is Tailwind v4 (CSS-first). Don't share config.
- **Mainnet by default.** Form input is real USDC. No devnet fallback in the
  UI — testing live costs real money. Use a burner wallet.
- **ActionCodes auth token** is the only secret in `.env.example`. RPC URL has
  a sane public default; bring your own for production load.

---

## Workflow (beans)

This repo follows the global beans workflow (`beans prime` on session start).
Milestones here are small — typically a single `feature` under one epic, since
allowly has no program/SDK/formal-verification surface. A meaningful change
usually touches: `packages/app` (the form/logic), optionally
`packages/app/public/agent/skill.md` (skill mirror), occasionally
`packages/remotion` (marketing). Don't pad milestones with layers you didn't
touch.
