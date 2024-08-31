---
title: demux/Raw.ts
nav_order: 15
parent: Modules
---

## Raw overview

Demux utilities for raw streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Branded Types](#branded-types)
  - [BidirectionalRawStreamSocket (type alias)](#bidirectionalrawstreamsocket-type-alias)
- [Casting](#casting)
  - [downcastBidirectionalToUnidirectional](#downcastbidirectionaltounidirectional)
  - [upcastUnidirectionalToBidirectional](#upcastunidirectionaltobidirectional)
- [Demux](#demux)
  - [demuxBidirectionalRawSocket](#demuxbidirectionalrawsocket)
  - [demuxUnidirectionalRawSockets](#demuxunidirectionalrawsockets)
- [Predicates](#predicates)
  - [isBidirectionalRawStreamSocket](#isbidirectionalrawstreamsocket)
  - [isUnidirectionalRawStreamSocket](#isunidirectionalrawstreamsocket)
  - [responseIsRawStreamSocketResponse](#responseisrawstreamsocketresponse)
  - [responseToRawStreamSocketOrFail](#responsetorawstreamsocketorfail)
- [Type ids](#type-ids)
  - [BidirectionalRawStreamSocketTypeId](#bidirectionalrawstreamsockettypeid)
  - [BidirectionalRawStreamSocketTypeId (type alias)](#bidirectionalrawstreamsockettypeid-type-alias)
  - [UnidirectionalRawStreamSocketTypeId](#unidirectionalrawstreamsockettypeid)
  - [UnidirectionalRawStreamSocketTypeId (type alias)](#unidirectionalrawstreamsockettypeid-type-alias)
- [Types](#types)
  - [RawStreamSocketContentType](#rawstreamsocketcontenttype)
  - [UnidirectionalRawStreamSocket (type alias)](#unidirectionalrawstreamsocket-type-alias)

---

# Branded Types

## BidirectionalRawStreamSocket (type alias)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

**Signature**

```ts
export type BidirectionalRawStreamSocket = Socket.Socket & {
  readonly "content-type": typeof RawStreamSocketContentType
  readonly [BidirectionalRawStreamSocketTypeId]: typeof BidirectionalRawStreamSocketTypeId
}
```

Added in v1.0.0

# Casting

## downcastBidirectionalToUnidirectional

**Signature**

```ts
export declare const downcastBidirectionalToUnidirectional: ({
  [BidirectionalRawStreamSocketTypeId]: _,
  ...rest
}: BidirectionalRawStreamSocket) => UnidirectionalRawStreamSocket
```

Added in v1.0.0

## upcastUnidirectionalToBidirectional

**Signature**

```ts
export declare const upcastUnidirectionalToBidirectional: ({
  [UnidirectionalRawStreamSocketTypeId]: _,
  ...rest
}: UnidirectionalRawStreamSocket) => BidirectionalRawStreamSocket
```

Added in v1.0.0

# Demux

## demuxBidirectionalRawSocket

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

To demux multiple raw sockets, you should use {@link demuxRawSockets}

**Signature**

```ts
export declare const demuxBidirectionalRawSocket: (<A1, E1, E2, R1, R2>(
  source: Stream.Stream<string | Uint8Array, E1, R1>,
  sink: Sink.Sink<A1, string, string, E2, R2>
) => (
  socket: BidirectionalRawStreamSocket
) => Effect.Effect<A1, Socket.SocketError | E1 | E2, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>) &
  (<A1, E1, E2, R1, R2>(
    socket: BidirectionalRawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>
  ) => Effect.Effect<A1, Socket.SocketError | E1 | E2, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>)
```

Added in v1.0.0

## demuxUnidirectionalRawSockets

Demux multiple raw sockets, created from multiple container attach websocket
requests. If no options are provided for a given stream, it will be ignored.
This is really just an Effect.all wrapper around {@link demuxRawSocket}.

To demux a single raw socket, you should use {@link demuxRawSocket}

**Signature**

```ts
export declare const demuxUnidirectionalRawSockets: <
  O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, UnidirectionalRawStreamSocket],
  O2 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
  O3 extends readonly [UnidirectionalRawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
  E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, UnidirectionalRawStreamSocket] ? E : never,
  E2 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
  E3 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
  R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, UnidirectionalRawStreamSocket] ? R : never,
  R2 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
  R3 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
  A1 = O2 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>]
    ? A
    : undefined,
  A2 = O3 extends [UnidirectionalRawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>]
    ? A
    : undefined
>(
  streams:
    | { stdin: O1; stdout?: undefined; stderr?: undefined }
    | { stdin?: undefined; stdout: O2; stderr?: undefined }
    | { stdin?: undefined; stdout?: undefined; stderr: O3 }
    | { stdin: O1; stdout: O2; stderr?: undefined }
    | { stdin: O1; stdout?: undefined; stderr: O3 }
    | { stdin?: undefined; stdout: O2; stderr: O3 }
    | { stdin: O1; stdout: O2; stderr: O3 }
) => Effect.Effect<
  CompressedDemuxOutput<A1, A2>,
  Socket.SocketError | E1 | E2 | E3,
  Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
>
```

Added in v1.0.0

# Predicates

## isBidirectionalRawStreamSocket

**Signature**

```ts
export declare const isBidirectionalRawStreamSocket: (u: unknown) => u is BidirectionalRawStreamSocket
```

Added in v1.0.0

## isUnidirectionalRawStreamSocket

**Signature**

```ts
export declare const isUnidirectionalRawStreamSocket: (u: unknown) => u is UnidirectionalRawStreamSocket
```

Added in v1.0.0

## responseIsRawStreamSocketResponse

**Signature**

```ts
export declare const responseIsRawStreamSocketResponse: (response: HttpClientResponse.HttpClientResponse) => boolean
```

Added in v1.0.0

## responseToRawStreamSocketOrFail

Transforms an http response into a raw stream socket. If the response is not
a raw stream socket, then an error will be returned.

**Signature**

```ts
export declare const responseToRawStreamSocketOrFail: (<
  SourceIsKnownUnidirectional extends true | undefined = undefined,
  SourceIsKnownBidirectional extends true | undefined = undefined
>(
  options?:
    | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
    | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
    | undefined
) => (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<
  SourceIsKnownUnidirectional extends true
    ? UnidirectionalRawStreamSocket
    : SourceIsKnownBidirectional extends true
      ? BidirectionalRawStreamSocket
      : BidirectionalRawStreamSocket | UnidirectionalRawStreamSocket,
  Socket.SocketError,
  never
>) &
  (<
    SourceIsKnownUnidirectional extends true | undefined = undefined,
    SourceIsKnownBidirectional extends true | undefined = undefined
  >(
    response: HttpClientResponse.HttpClientResponse,
    options?:
      | { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional }
      | { sourceIsKnownBidirectional: SourceIsKnownBidirectional }
      | undefined
  ) => Effect.Effect<
    SourceIsKnownUnidirectional extends true
      ? UnidirectionalRawStreamSocket
      : SourceIsKnownBidirectional extends true
        ? BidirectionalRawStreamSocket
        : BidirectionalRawStreamSocket | UnidirectionalRawStreamSocket,
    Socket.SocketError,
    never
  >)
```

Added in v1.0.0

# Type ids

## BidirectionalRawStreamSocketTypeId

**Signature**

```ts
export declare const BidirectionalRawStreamSocketTypeId: typeof BidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

## BidirectionalRawStreamSocketTypeId (type alias)

**Signature**

```ts
export type BidirectionalRawStreamSocketTypeId = typeof BidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

## UnidirectionalRawStreamSocketTypeId

**Signature**

```ts
export declare const UnidirectionalRawStreamSocketTypeId: typeof UnidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

## UnidirectionalRawStreamSocketTypeId (type alias)

**Signature**

```ts
export type UnidirectionalRawStreamSocketTypeId = typeof UnidirectionalRawStreamSocketTypeId
```

Added in v1.0.0

# Types

## RawStreamSocketContentType

**Signature**

```ts
export declare const RawStreamSocketContentType: "application/vnd.docker.raw-stream"
```

Added in v1.0.0

## UnidirectionalRawStreamSocket (type alias)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

**Signature**

```ts
export type UnidirectionalRawStreamSocket = Socket.Socket & {
  readonly "content-type": typeof RawStreamSocketContentType
  readonly [UnidirectionalRawStreamSocketTypeId]: typeof UnidirectionalRawStreamSocketTypeId
}
```

Added in v1.0.0
