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
  - [interleaveBackToSocket](#interleavebacktosocket)
  - [interleaveToStream](#interleavetostream)

---

# Interleave

## interleaveBackToSocket

Interleave stdout and stderr streams back into a socket.

**Signature**

```ts
export declare const interleaveBackToSocket: {
  (stdout: RawStreamSocket, stderr: RawStreamSocket): Effect.Effect<RawStreamSocket, never, never>
  (
    stdout: MultiplexedStreamSocket,
    stderr: MultiplexedStreamSocket
  ): Effect.Effect<MultiplexedStreamSocket, never, never>
}
```

Added in v1.0.0

## interleaveToStream

Interleave stdout and stderr streams.

**Signature**

```ts
export declare const interleaveToStream: {
  (stdout: RawStreamSocket, stderr: RawStreamSocket): Stream.Stream<Uint8Array, Socket.SocketError, never>
  (
    stdout: MultiplexedStreamSocket,
    stderr: MultiplexedStreamSocket
  ): Stream.Stream<Uint8Array, Socket.SocketError, never>
}
```

Added in v1.0.0
