---
# allowly-xq26
title: Delete unused remotion CallToAction.tsx
status: completed
type: task
priority: normal
tags:
    - ponytail
    - delete
    - remotion
created_at: 2026-07-06T12:37:14Z
updated_at: 2026-07-06T13:36:26Z
parent: allowly-rhix
---

**Finding**: `packages/remotion/src/components/CallToAction.tsx` — zero imports (the role is filled by `FinalCTA.tsx`).

**Cut**: delete the whole file (98 lines).

**Why**: dead code.

**Verify**: `pnpm --filter remotion build` clean.

**Risk**: zero.

## Summary of Changes

Deleted packages/remotion/src/components/CallToAction.tsx (98 lines, zero imports; role filled by FinalCTA.tsx). pnpm --filter remotion build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
