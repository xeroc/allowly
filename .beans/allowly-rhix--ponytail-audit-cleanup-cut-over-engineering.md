---
# allowly-rhix
title: Ponytail audit cleanup — cut over-engineering
status: todo
type: epic
priority: high
tags:
    - ponytail
    - cleanup
    - audit
created_at: 2026-07-06T12:35:49Z
updated_at: 2026-07-06T12:35:49Z
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
