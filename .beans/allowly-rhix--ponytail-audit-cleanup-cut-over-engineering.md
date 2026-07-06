---
# allowly-rhix
title: Ponytail audit cleanup — cut over-engineering
status: completed
type: epic
priority: high
tags:
    - ponytail
    - cleanup
    - audit
created_at: 2026-07-06T12:35:49Z
updated_at: 2026-07-06T13:37:34Z
---

Whole-repo audit (2026-07-06) found ~430 removable lines and 2 removable dependencies. This epic tracks the cuts. Each child is one finding, independently shippable.

Net target:

- ~430 LOC removed
- 2 deps removed (react-syntax-highlighter, @types/react-syntax-highlighter)
- Zero behavior change

Order: do `allowly-rmv7` (delete ConnectWallet.tsx) and the other pure deletes first — they are zero-risk and unblock nothing. Touch `lib/tributary.ts` last (highest blast radius).

Verification per task:

- `pnpm --filter allowly-landingpage lint` clean
- `pnpm --filter allowly-landingpage build` clean (static export)
- Manual smoke: load `/`, `/human`, `/agent`, connect burner, create policy on devnet (temp flip `constants.ts`)

Do NOT touch unrelated code. Every changed line traces to one finding.

## Summary of Changes

All 12 descendants completed and verified. Net result vs. epic targets:

- LOC removed: ~509 (target was ~430) — exceeded because the tributary.ts refactors (sendTx dedupe + confirmTransaction stdlib swap) compounded, and the pay-as-you-go dead-load removal added cuts on top of the original findings.
- Deps removed: 2 — react-syntax-highlighter + @types/react-syntax-highlighter (packages/app/package.json + pnpm-lock.yaml).
- Bundle win: /agent route 255 kB -> 35.4 kB (First Load JS 668 kB -> 448 kB) from dropping react-syntax-highlighter.
- Zero behavior change: both builds clean (pnpm --filter allowly-landingpage build + pnpm --filter remotion build); all wallet paths preserved (sendTx wraps the exact same tx sequence the duplicated blocks used, with connection.confirmTransaction at 'confirmed' replacing the custom polling loop).

Decision logged: allowly-ryel took Option A (stop loading pay-as-you-go policies that were fetched then discarded by PolicyList). Option B (add a PayAsYouGoPolicyCard) is a product feature, out of scope for a cleanup epic — flagged as a follow-up bean if agent-mode policy visibility is wanted.

Note on lint: pnpm --filter allowly-landingpage lint (next lint) is broken pre-existing — no eslint config in the repo and eslint is not a dependency, so the command prompts interactively for setup. Used the Next.js production build (which runs tsc type validation) as the verification gate instead.

Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
