---
# allowly-g88e
title: Replace confirmTransactionWithStatus with connection.confirmTransaction
status: completed
type: task
priority: high
tags:
    - ponytail
    - stdlib
    - tributary-ts
created_at: 2026-07-06T12:36:10Z
updated_at: 2026-07-06T13:37:03Z
parent: allowly-rhix
---

**Finding**: `confirmTransactionWithStatus()` + `sleep()` reinvent `@solana/web3.js` built-in.

**Cut**: `packages/app/lib/tributary.ts:72-112` (42 lines)

**Replace with**: `await connection.confirmTransaction(txid, "confirmed")` — single-line call returning the same `{ value }` shape. Wrap once if you want timeout/error normalization.

**Why**: stdlib does this. Custom polling loop is 40 lines of code that does what one call does.

**Verify**: build passes, manual create-pause-cancel on devnet still confirms.

**Risk**: medium — touches every tx path in tributary.ts. Do alongside `allowly-dedupe-sendtx` if it lands first, otherwise standalone.

## Summary of Changes

Removed confirmTransactionWithStatus + sleep from packages/app/lib/tributary.ts (~42 lines). All tx paths now confirm via the @solana/web3.js stdlib: connection.confirmTransaction(txid, 'confirmed'), invoked inside the new sendTx helper (see allowly-9tjg, landed in the same commit). Custom polling loop replaced 1:1 by the stdlib call at the same commitment level. Build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
