---
# allowly-m7fc
title: Remove 5 unused framer-motion variants from lib/animations.ts
status: completed
type: task
priority: normal
tags:
    - ponytail
    - delete
    - animations
created_at: 2026-07-06T12:37:33Z
updated_at: 2026-07-06T13:36:44Z
parent: allowly-rhix
---

**Finding**: 5 variants in `packages/app/lib/animations.ts` have zero grep hits across the codebase (excluding the export file itself):

- `staggerContainer` (L25-31)
- `slideInLeft` (L42-49)
- `slideInRight` (L51-58)
- `cardReveal` (L84-96)
- `pageTransition` (L140-144)

**Cut**: drop all 5 exports (~30 lines).

**Keep** (in use): `fadeInUp` (18), `fadeInUpStagger` (4), `scaleIn` (2), `hoverScale` (8), `buttonPress` (9), `inputFocus` (9), `stepReveal` (1), `floatingAnimation` (2), `pulseGlow` (2), `shimmer` (2).

**Why**: speculative animation library that never got wired up.

**Verify**: lint clean, build clean, no visual regressions on `/`, `/human`, `/agent`.

**Risk**: low. Verify counts with: `grep -rn "<NAME>" packages/app --include="*.tsx" --include="*.ts" | grep -v "lib/animations.ts"`

## Summary of Changes

Removed 5 unused variants (staggerContainer, slideInLeft, slideInRight, cardReveal, pageTransition) from packages/app/lib/animations.ts (~30 lines). Kept the 10 in-use variants (verified via grep counts). Build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
