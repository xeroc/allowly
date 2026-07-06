---
# allowly-ecwc
title: Delete unused ConnectWallet.tsx
status: completed
type: task
priority: normal
tags:
    - ponytail
    - delete
created_at: 2026-07-06T12:37:00Z
updated_at: 2026-07-06T13:36:26Z
parent: allowly-rhix
---

**Finding**: `packages/app/components/ConnectWallet.tsx` — zero imports. `grep -rn "ConnectWallet" packages/app` matches only the file itself.

**Cut**: delete the whole file (54 lines).

**Why**: dead code. Connect UI lives in `FormActions.tsx` + `WalletProvider.tsx` now.

**Verify**: build clean. No behavior change.

**Risk**: zero.

## Summary of Changes

Deleted packages/app/components/ConnectWallet.tsx (54 lines, zero imports — connect UI lives in FormActions.tsx + WalletProvider.tsx). Build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
