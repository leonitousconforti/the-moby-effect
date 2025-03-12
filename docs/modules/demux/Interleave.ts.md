---
title: demux/Interleave.ts
nav_order: 5
parent: Modules
---

## Interleave overview

Common interleaving utilities for hijacked docker streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Interleave](#interleave)
  - [interleaveToStream](#interleavetostream)
  - [interleaveToTaggedStream](#interleavetotaggedstream)

---

# Interleave

## interleaveToStream

Interleaves an stdout socket with an stderr socket.

**Signature**

```ts
export declare const interleaveToStream: (
  stdout: RawStreamSocket,
  stderr: RawStreamSocket
) => Stream.Stream<Uint8Array, Socket.SocketError, never>
```

Added in v1.0.0

## interleaveToTaggedStream

Interleaves an stdout socket with an stderr socket and tags the output
stream.

**Signature**

```ts
export declare const interleaveToTaggedStream: (
  stdout: RawStreamSocket,
  stderr: RawStreamSocket,
  options?: { bufferSize?: number | undefined } | undefined
) => Stream.Stream<
  { _tag: "stdout"; value: Uint8Array } | { _tag: "stderr"; value: Uint8Array },
  Socket.SocketError,
  never
>
```

Added in v1.0.0
