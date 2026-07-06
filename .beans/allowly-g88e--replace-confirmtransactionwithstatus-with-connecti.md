---
# allowly-g88e
title: Replace confirmTransactionWithStatus with connection.confirmTransaction
status: todo
type: task
priority: high
tags:
    - ponytail
    - stdlib
    - tributary-ts
created_at: 2026-07-06T12:36:10Z
updated_at: 2026-07-06T12:36:10Z
parent: allowly-rhix
---

**Finding**: `confirmTransactionWithStatus()` + `sleep()` reinvent `@solana/web3.js` built-in.

**Cut**: `packages/app/lib/tributary.ts:72-112` (42 lines)

**Replace with**: `await connection.confirmTransaction(txid, "confirmed")` — single-line call returning the same `{ value }` shape. Wrap once if you want timeout/error normalization.

**Why**: stdlib does this. Custom polling loop is 40 lines of code that does what one call does.

**Verify**: build passes, manual create-pause-cancel on devnet still confirms.

**Risk**: medium — touches every tx path in tributary.ts. Do alongside `allowly-dedupe-sendtx` if it lands first, otherwise standalone.
