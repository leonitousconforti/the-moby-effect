---
title: engines/Compose.ts
nav_order: 24
parent: Modules
---

## Compose overview

Docker compose engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [ComposeImpl (interface)](#composeimpl-interface)

---

# utils

## ComposeImpl (interface)

Docker compose engine

**Signature**

```ts
export interface ComposeImpl {
  up: () => void
  down: () => void
}
```

Added in v1.0.0
