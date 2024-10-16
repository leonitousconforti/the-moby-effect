---
title: demux/Multiplexed.ts
nav_order: 7
parent: Modules
---

## Multiplexed overview

Demux utilities for multiplexed sockets. You can receive data (both stdout
and stderr) distinctly and send data (stdin) all over the same socket.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [makeMultiplexedStreamSocket](#makemultiplexedstreamsocket)
- [Demux](#demux)
  - [demuxMultiplexedSocket](#demuxmultiplexedsocket)
  - [demuxMultiplexedSocketFolderSink](#demuxmultiplexedsocketfoldersink)
- [Predicates](#predicates)
  - [isMultiplexedStreamSocket](#ismultiplexedstreamsocket)
  - [responseIsMultiplexedStreamSocketResponse](#responseismultiplexedstreamsocketresponse)
- [Schemas](#schemas)
  - [MultiplexedStreamSocketSchema](#multiplexedstreamsocketschema)
- [Type ids](#type-ids)
  - [MultiplexedStreamSocketTypeId](#multiplexedstreamsockettypeid)
  - [MultiplexedStreamSocketTypeId (type alias)](#multiplexedstreamsockettypeid-type-alias)
- [Types](#types)
  - [$MultiplexedStreamSocketSchema (interface)](#multiplexedstreamsocketschema-interface)
  - [MultiplexedStreamSocket (type alias)](#multiplexedstreamsocket-type-alias)
  - [MultiplexedStreamSocketAccumulator (type alias)](#multiplexedstreamsocketaccumulator-type-alias)
  - [MultiplexedStreamSocketContentType](#multiplexedstreamsocketcontenttype)

---

# Constructors

## makeMultiplexedStreamSocket

**Signature**

```ts
export declare const makeMultiplexedStreamSocket: (socket: Socket.Socket) => MultiplexedStreamSocket
```

Added in v1.0.0

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

## demuxMultiplexedSocketFolderSink

Accumulates the header and its message bytes into a single value.

**Signature**

```ts
export declare const demuxMultiplexedSocketFolderSink: Sink.Sink<
  MultiplexedStreamSocketAccumulator,
  number,
  number,
  ParseResult.ParseError,
  never
>
```

Added in v1.0.0

# Predicates

## isMultiplexedStreamSocket

**Signature**

```ts
export declare const isMultiplexedStreamSocket: (u: unknown) => u is MultiplexedStreamSocket
```

Added in v1.0.0

## responseIsMultiplexedStreamSocketResponse

**Signature**

```ts
export declare const responseIsMultiplexedStreamSocketResponse: (
  response: HttpClientResponse.HttpClientResponse
) => boolean
```

Added in v1.0.0

# Schemas

## MultiplexedStreamSocketSchema

**Signature**

```ts
export declare const MultiplexedStreamSocketSchema: $MultiplexedStreamSocketSchema
```

Added in v1.0.0

# Type ids

## MultiplexedStreamSocketTypeId

**Signature**

```ts
export declare const MultiplexedStreamSocketTypeId: typeof MultiplexedStreamSocketTypeId
```

Added in v1.0.0

## MultiplexedStreamSocketTypeId (type alias)

**Signature**

```ts
export type MultiplexedStreamSocketTypeId = typeof MultiplexedStreamSocketTypeId
```

Added in v1.0.0

# Types

## $MultiplexedStreamSocketSchema (interface)

**Signature**

```ts
export interface $MultiplexedStreamSocketSchema
  extends Schema.Tuple<
    [Schema.Enums<typeof MultiplexedStreamSocketHeaderType>, Schema.Schema<Uint8Array, ReadonlyArray<number>, never>]
  > {}
```

Added in v1.0.0

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

## MultiplexedStreamSocketAccumulator (type alias)

**Signature**

```ts
export type MultiplexedStreamSocketAccumulator = {
  headerBytesRead: number
  messageBytesRead: number
  headerBuffer: Chunk.Chunk<number>
  messageBuffer: Chunk.Chunk<number>
  messageSize: number | undefined
  messageType: number | undefined
}
```

Added in v1.0.0

## MultiplexedStreamSocketContentType

**Signature**

```ts
export declare const MultiplexedStreamSocketContentType: "application/vnd.docker.multiplexed-stream"
```

Added in v1.0.0
