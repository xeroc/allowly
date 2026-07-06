---
# allowly-cafs
title: Remove 6 unused Tailwind animations + keyframes
status: todo
type: task
priority: normal
tags:
    - ponytail
    - delete
    - tailwind
created_at: 2026-07-06T12:37:33Z
updated_at: 2026-07-06T12:37:33Z
parent: allowly-rhix
---

**Finding**: 6 entries in `packages/app/tailwind.config.ts:64-90` define `animation.*` entries plus their `keyframes.*` pairs. None are used as `animate-*` classes anywhere in the codebase.

**Cut** (L64-90, ~30 lines):

- `animation.fade-in` + `keyframes.fadeIn`
- `animation.slide-up` + `keyframes.slideUp`
- `animation.scale-in` + `keyframes.scaleIn`
- `animation.float` + `keyframes.float`
- `animation.pulse-glow` + `keyframes.pulseGlow`
- `animation.shimmer` + `keyframes.shimmer`

**Why**: every animation in the app goes through framer-motion (see `lib/animations.ts`). The Tailwind animation surface is unused.

**Verify**: lint clean, build clean. Verify with: `grep -rn "animate-fade-in\|animate-slide-up\|animate-scale-in\|animate-float\|animate-pulse-glow\|animate-shimmer" packages/app` (expect zero hits).

**Risk**: low. Tailwind purges unused classes anyway, but the config lines themselves are removable.
