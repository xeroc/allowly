---
# allowly-chyk
title: Delete duplicate frameUtils.ts (typewriter.ts is the live one)
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

**Finding**: `packages/remotion/src/utils/frameUtils.ts` is a byte-for-byte duplicate of `typewriter.ts` in the same dir. `FormInteraction.tsx` imports `typewriter` only.

**Cut**: delete `frameUtils.ts` (11 lines).

**Why**: accidental duplicate — same export, same impl, zero callers.

**Verify**: `pnpm --filter remotion build` clean. Video unchanged.

**Risk**: zero.

## Summary of Changes

Deleted packages/remotion/src/utils/frameUtils.ts (11 lines; byte-identical duplicate of typewriter.ts, the live one). pnpm --filter remotion build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
