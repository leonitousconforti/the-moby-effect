---
title: demux/Demux.ts
nav_order: 4
parent: Modules
---

## Demux overview

Common demux utilities for hijacked docker streams.

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

Demux either a multiplexed socket or unidirectional socket(s) to separate
sinks. If you need to also demux a bidirectional raw socket, then use
{@link demuxUnknownToSeparateSinks} instead.

**Signature**

```ts
export declare const demuxToSeparateSinks: {
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
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    sockets: {
      stdout: UnidirectionalRawStreamSocket
      stdin?: UnidirectionalRawStreamSocket | undefined
      stderr?: UnidirectionalRawStreamSocket | undefined
    },
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

Added in v1.0.0

## demuxToSingleSink

Demux either a bidirectional raw socket, multiplexed socket, or
unidirectional raw socket(s) to a single sink.

**Signature**

```ts
export declare const demuxToSingleSink: {
  <A1, E1, E2, R1, R2>(
    socket: BidirectionalRawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (
    socket: BidirectionalRawStreamSocket
  ) => Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    socket: UnidirectionalRawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (
    sockets: UnidirectionalRawStreamSocket
  ) => Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    sockets: {
      stdout: UnidirectionalRawStreamSocket
      stdin?: UnidirectionalRawStreamSocket | undefined
      stderr?: UnidirectionalRawStreamSocket | undefined
    },
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { bufferSize?: number | undefined; encoding: string | undefined } | undefined
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect.Effect<
    A1,
    E1 | E2 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>
  >
}
```

Added in v1.0.0

## demuxUnknownToSeparateSinks

Demux a bidirectional raw socket, multiplexed socket, or unidirectional raw
sockets to two sinks. If given a bidirectional raw stream socket, then stdout
and stderr will be combined on the same sink. If given a multiplexed stream
socket, then stdout and stderr will be forwarded to different sinks. If given
a unidirectional raw stream sockets, then you are only required to provide
one for stdout but can also provide sockets for stdin and stderr as well. The
return type will depend on the type of socket provided, so this isn't
suitable for all use cases.

**Signature**

```ts
export declare const demuxUnknownToSeparateSinks: {
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: BidirectionalRawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (
    socket: BidirectionalRawStreamSocket
  ) => Effect.Effect<
    A1,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
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
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    sockets: {
      stdout: UnidirectionalRawStreamSocket
      stdin?: UnidirectionalRawStreamSocket | undefined
      stderr?: UnidirectionalRawStreamSocket | undefined
    },
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ): (sockets: {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  }) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

Added in v1.0.0
