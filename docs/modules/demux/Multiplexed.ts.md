---
title: demux/Multiplexed.ts
nav_order: 6
parent: Modules
---

## Multiplexed overview

Demux utilities for multiplexed sockets. You can receive data (both stdout
and stderr) distinctly and send data (stdin) all over the same socket.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Demux](#demux)
  - [demuxMultiplexedSocket](#demuxmultiplexedsocket)
- [Predicates](#predicates)
  - [isMultiplexedStreamSocket](#ismultiplexedstreamsocket)
- [Types](#types)
  - [MultiplexedStreamSocket (type alias)](#multiplexedstreamsocket-type-alias)

---

# Demux

## demuxMultiplexedSocket

Demux a multiplexed socket. When given a multiplexed socket, we must parse
the chunks by headers and then forward each chunk based on its datatype to
the correct sink.

When partitioning the stream into stdout and stderr, the first sink may
advance by up to bufferSize elements further than the slower one. The default
bufferSize is 16.

**Signature**

```ts
export declare const demuxMultiplexedSocket: {
  <A1, E1, E2, R1, R2>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, never>,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, never>,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

Added in v1.0.0

# Predicates

## isMultiplexedStreamSocket

**Signature**

```ts
export declare const isMultiplexedStreamSocket: (u: unknown) => u is MultiplexedStreamSocket
```

Added in v1.0.0

# Types

## MultiplexedStreamSocket (type alias)

When the TTY setting is disabled in POST /containers/create, the HTTP
Content-Type header is set to application/vnd.docker.multiplexed-stream and
the stream over the hijacked connected is multiplexed to separate out stdout
and stderr. The stream consists of a series of frames, each containing a
header and a payload.

**Signature**

```ts
export type MultiplexedStreamSocket = Socket.Socket & {
  readonly "content-type": typeof MultiplexedStreamSocketContentType
  readonly [MultiplexedStreamSocketTypeId]: MultiplexedStreamSocketTypeId
}
```

Added in v1.0.0
