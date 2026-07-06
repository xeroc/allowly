---
# allowly-ryel
title: Wire pay-as-you-go policies into PolicyList (or stop loading them)
status: todo
type: task
priority: high
tags:
    - ponytail
    - bug
    - tributary-ts
created_at: 2026-07-06T12:37:55Z
updated_at: 2026-07-06T12:37:55Z
parent: allowly-rhix
---

**Finding**: `getPolicies()` populates `payAsYouGo: PayAsYouGoPolicy[]` and `PolicyList` stores it in state — but `PolicyList.tsx:46-51` only renders `policies.subscriptions`. Pay-as-you-go policies created via `AgentPolicyForm` are loaded from chain and then thrown away.

This is over-engineering OR a missing UI — pick one:

**Option A (lazy fix — just stop loading)**:

- `packages/app/lib/tributary.ts`: drop the `payAsYouGo` branch from `getPolicies` (~17 lines, L300-334 second half)
- `packages/app/lib/tributary.ts:60-64`: drop `payAsYouGo` from `PolicyListResult` interface
- `packages/app/components/PolicyList.tsx:14-15, 23`: drop `payAsYouGo: []` from state

**Option B (correct fix — add a `PayAsYouGoPolicyCard`)**:

- New component ~80 lines mirroring `PolicyCard.tsx` for the pay-go fields (max budget, max per claim, period)
- `PolicyList.tsx`: render both arrays
- Update `payAsYouGo` empty-state copy

**Recommendation**: Option B is the right product call (agent mode creates policies the user can never see), but Option A is the lazy cleanup. **Ask Fabian which one** before implementing.

**Verify**:

- Option A: build clean, agent policy creation still works (just no list rendering after)
- Option B: build clean, create pay-go on devnet, see it appear in list with correct fields

**Risk**: low (A) / medium (B). Decision required before implementation.
