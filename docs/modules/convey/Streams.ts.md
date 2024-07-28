---
title: convey/Streams.ts
nav_order: 3
parent: Modules
---

## Streams overview

Prepares streams for the Docker API.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [packBuildContextIntoTarballStream](#packbuildcontextintotarballstream)

---

# utils

## packBuildContextIntoTarballStream

Packs the context into a tarball stream to use with the build endpoint.

**Signature**

```ts
export declare const packBuildContextIntoTarballStream: (
  cwd: string,
  entries?: Array<string>
) => Stream.Stream<Uint8Array, Images.ImagesError, never>
```

Added in v1.0.0
