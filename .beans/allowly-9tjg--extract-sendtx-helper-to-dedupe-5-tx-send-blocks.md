---
# allowly-9tjg
title: Extract sendTx helper to dedupe 5 tx-send blocks
status: todo
type: task
priority: high
tags:
    - ponytail
    - shrink
    - tributary-ts
created_at: 2026-07-06T12:36:31Z
updated_at: 2026-07-06T12:36:31Z
parent: allowly-rhix
blocked_by:
    - allowly-g88e
---

**Finding**: 5× copy-paste of the same 11-line block: `new Transaction().add(...)` → blockhash → feePayer → sign → send → confirm.

**Cut**: `packages/app/lib/tributary.ts:188-199, 251-262, 356-366, 382-392, 404-414` (~55 lines duplicated)

**Replace with**: one helper, ~12 lines:

```ts
async function sendTx(wallet: WalletContextState, instructions: TransactionInstruction[] | TransactionInstruction, connection: Connection): Promise<void> {
  const tx = new Transaction().add(...(Array.isArray(instructions) ? instructions : [instructions]));
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey!;
  const signed = await wallet.signTransaction!(tx);
  const txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "confirmed");
}
```

Each public fn becomes: build instructions → `await sendTx(wallet, instructions, tributary.connection)` → read result.

**Why**: pure duplication. Bug-fix surface area is 5× what it needs to be.

**Verify**: each of the 5 callers still works (create allowance, create paygo, pause, resume, cancel).

**Risk**: medium — same blast radius as the confirmTx removal. Land AFTER `allowly-g88e` (confirm-replacement) so the helper is built against the new confirm path.
