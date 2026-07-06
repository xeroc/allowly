---
# allowly-icqs
title: Simplify PolicyRefreshContext — useState → useRef for timeout handle
status: todo
type: task
priority: low
tags:
    - ponytail
    - shrink
created_at: 2026-07-06T12:38:12Z
updated_at: 2026-07-06T12:38:12Z
parent: allowly-rhix
---

**Finding**: `packages/app/components/PolicyRefreshContext.tsx:22-33` stores the debounce timeout handle in `useState`, which forces `useCallback(triggerRefresh, [timeoutId])` to recreate the callback on every timer fire (defeating the purpose of `useCallback`).

**Cut**: the `useState` for `timeoutId`, plus the `timeoutId` dep on `useCallback`.

**Replace with** (~5 lines net):

```ts
const timeoutRef = useRef<NodeJS.Timeout | null>(null);
const triggerRefresh = useCallback(() => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(() => setRefreshKey((n) => n + 1), 1500);
}, []);
```

**Why**: a mutable timer handle does not belong in state. `useRef` is the platform-correct primitive.

**Verify**: create a subscription policy → policy list refreshes ~1.5s later (debounced) → still works.

**Risk**: low. Self-contained component.
