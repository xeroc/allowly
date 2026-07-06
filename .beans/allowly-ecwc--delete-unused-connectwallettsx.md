---
# allowly-ecwc
title: Delete unused ConnectWallet.tsx
status: todo
type: task
priority: normal
tags:
    - ponytail
    - delete
created_at: 2026-07-06T12:37:00Z
updated_at: 2026-07-06T12:37:00Z
parent: allowly-rhix
---

**Finding**: `packages/app/components/ConnectWallet.tsx` — zero imports. `grep -rn "ConnectWallet" packages/app` matches only the file itself.

**Cut**: delete the whole file (54 lines).

**Why**: dead code. Connect UI lives in `FormActions.tsx` + `WalletProvider.tsx` now.

**Verify**: build clean. No behavior change.

**Risk**: zero.
