---
title: Demux.ts
nav_order: 2
parent: Modules
---

## Demux overview

Demux utilities for different types of docker streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Demux](#demux)
  - [demuxToSeparateSinks](#demuxtoseparatesinks)
  - [demuxToSingleSink](#demuxtosinglesink)
  - [demuxUnknownToSeparateSinks](#demuxunknowntoseparatesinks)

---

# Demux

## demuxToSeparateSinks

**Signature**

```ts
export declare const demuxToSeparateSinks: {
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: MultiplexedStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError | ParseError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError | ParseError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    sockets: {
      stdout: UnidirectionalRawStreamSocket
      stdin?: UnidirectionalRawStreamSocket | undefined
      stderr?: UnidirectionalRawStreamSocket | undefined
    },
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
}
```

Added in v1.0.0

## demuxToSingleSink

**Signature**

```ts
export declare const demuxToSingleSink: {
  <A1, E1, E2, R1, R2>(
    socket: BidirectionalRawStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (
    socket: BidirectionalRawStreamSocket
  ) => Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    socket: MultiplexedStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    socket: UnidirectionalRawStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (
    sockets: UnidirectionalRawStreamSocket
  ) => Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    sockets: {
      stdout: UnidirectionalRawStreamSocket
      stdin?: UnidirectionalRawStreamSocket | undefined
      stderr?: UnidirectionalRawStreamSocket | undefined
    },
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect<A1, E1 | E2 | SocketError | ParseError, Exclude<R1, Scope> | Exclude<R2, Scope>>
}
```

Added in v1.0.0

## demuxUnknownToSeparateSinks

**Signature**

```ts
export declare const demuxUnknownToSeparateSinks: {
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: BidirectionalRawStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect<A1, E1 | E2 | E3 | SocketError, Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>>
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: BidirectionalRawStreamSocket
  ) => Effect<A1, E1 | E2 | E3 | SocketError, Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>>
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: MultiplexedStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError | ParseError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError | ParseError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    sockets: {
      stdout: UnidirectionalRawStreamSocket
      stdin?: UnidirectionalRawStreamSocket | undefined
      stderr?: UnidirectionalRawStreamSocket | undefined
    },
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | SocketError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
}
```

Added in v1.0.0
