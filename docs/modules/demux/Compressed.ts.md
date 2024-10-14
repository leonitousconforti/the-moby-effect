---
title: demux/Compressed.ts
nav_order: 4
parent: Modules
---

## Compressed overview

Compressing utilities for demuxing.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Demux Helpers](#demux-helpers)
  - [compressDemuxOutput](#compressdemuxoutput)
- [Types](#types)
  - [CompressedDemuxOutput (type alias)](#compresseddemuxoutput-type-alias)

---

# Demux Helpers

## compressDemuxOutput

**Signature**

```ts
export declare const compressDemuxOutput: <A1, A2>(
  data: readonly [ranStdout: A1, ranStderr: A2]
) => CompressedDemuxOutput<A1, A2>
```

Added in v1.0.0

# Types

## CompressedDemuxOutput (type alias)

**Signature**

```ts
export type CompressedDemuxOutput<A1, A2> = A1 extends undefined | void
  ? A2 extends undefined | void
    ? void
    : readonly [stdout: undefined, stderr: A2]
  : A2 extends undefined | void
    ? readonly [stdout: A1, stderr: undefined]
    : readonly [stdout: A1, stderr: A2]
```

Added in v1.0.0
