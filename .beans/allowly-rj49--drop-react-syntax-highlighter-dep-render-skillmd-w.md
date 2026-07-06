---
# allowly-rj49
title: Drop react-syntax-highlighter dep — render skill.md with bare react-markdown
status: completed
type: task
priority: high
tags:
    - ponytail
    - delete
    - deps
created_at: 2026-07-06T12:36:48Z
updated_at: 2026-07-06T13:36:44Z
parent: allowly-rhix
---

**Finding**: `react-syntax-highlighter` (~1.5MB bundle) pulled in to colorize **one** static markdown file (`/agent/skill.md`). `react-markdown` is already a dep and already used.

**Cut**:

- `packages/app/package.json`: remove `react-syntax-highlighter` and `@types/react-syntax-highlighter`
- `packages/app/app/agent/page.tsx:10-11` (Prism + vscDarkPlus imports)
- `packages/app/app/agent/page.tsx:44-79` (`PreBlock` + `CodeBlock` inline components)
- The `components={{ code: CodeBlock }}` prop on `<ReactMarkdown>`

**Replace with**: `<ReactMarkdown>{skillCode}</ReactMarkdown>` — no custom code renderer. Add a global `pre`/`code` style in `globals.css` if needed (~5 lines of `.prose pre { ... }`).

**Why**: syntax highlighting on a single static file is not worth a 1.5MB dep. CSS does fine.

**Verify**: `/agent` page still renders the skill markdown readably. Copy and download buttons still work (they operate on raw `skillCode` state, untouched).

**Risk**: low. UI-only change, no wallet path touched.

## Summary of Changes

Dropped react-syntax-highlighter + @types/react-syntax-highlighter from packages/app/package.json; removed Prism/vscDarkPlus imports and the PreBlock + CodeBlock components from packages/app/app/agent/page.tsx; ReactMarkdown now renders bare (the existing prose prose-invert classes style pre/code). /agent route size 255 kB -> 35.4 kB (First Load JS 668 kB -> 448 kB). Build clean. Lands in the ponytail-audit cleanup commit on branch bean-allowly-rhix.
