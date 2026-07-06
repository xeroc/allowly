---
# allowly-j55h
title: Delete unused remotion Headline.tsx
status: todo
type: task
priority: normal
tags:
    - ponytail
    - delete
    - remotion
created_at: 2026-07-06T12:37:00Z
updated_at: 2026-07-06T12:37:00Z
parent: allowly-rhix
---

**Finding**: `packages/remotion/src/components/Headline.tsx` — zero imports. Superseded by `EnhancedHeadline.tsx` used in `Composition.tsx`.

**Cut**: delete the whole file (63 lines).

**Why**: dead code.

**Verify**: `pnpm --filter remotion build` clean. Video unchanged.

**Risk**: zero.
