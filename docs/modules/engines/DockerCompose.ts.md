---
title: engines/DockerCompose.ts
nav_order: 32
parent: Modules
---

## DockerCompose overview

Docker compose engine

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [DockerComposeImpl (interface)](#dockercomposeimpl-interface)

---

# utils

## DockerComposeImpl (interface)

Docker compose engine

**Signature**

```ts
export interface DockerComposeImpl {
  up: () => void
  down: () => void
  pull: () => void
  build: () => void
}
```

Added in v1.0.0
