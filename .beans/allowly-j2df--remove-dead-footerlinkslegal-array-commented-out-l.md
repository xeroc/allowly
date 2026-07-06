---
# allowly-j2df
title: Remove dead footerLinks.legal array + commented-out Legal section
status: completed
type: task
priority: normal
tags:
    - ponytail
    - delete
created_at: 2026-07-06T12:37:55Z
updated_at: 2026-07-06T13:36:44Z
parent: allowly-rhix
---

**Finding**: `packages/app/components/Footer.tsx` defines a `legal` array of placeholder links with `href: "#"`, and a commented-out JSX block that would render them. The other three sections (product, resources, community) render fine; legal was never shipped.

**Cut**:

- `packages/app/components/Footer.tsx:33-36` (`legal: [...]` in `footerLinks`)
- `packages/app/components/Footer.tsx:249-270` (the commented `<motion.div>` block)

(~24 lines total.)

**Why**: commented-out code is debt. If legal pages are needed later, add them then.

**Verify**: footer still renders, no console errors.

**Risk**: zero.

## Summary of Changes

Removed the footerLinks.legal array and the commented-out Legal motion.div block from packages/app/components/Footer.tsx (~24 lines). Footer still renders product/resources/community. Build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
