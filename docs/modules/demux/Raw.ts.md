---
title: demux/Raw.ts
nav_order: 8
parent: Modules
---

## Raw overview

Demux utilities for raw sockets. Unlike multiplexed sockets, raw sockets can
not differentiate between stdout and stderr because the data is just raw
bytes from the process's PTY. However, you can attach multiple raw sockets to
the same container (one for stdout and one for stderr) and then use the demux
utilities to separate the streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Branded Types](#branded-types)
  - [RawStreamSocket (type alias)](#rawstreamsocket-type-alias)
- [Constructors](#constructors)
  - [makeRawStreamSocket](#makerawstreamsocket)
- [Demux](#demux)
  - [demuxRawSocket](#demuxrawsocket)
  - [demuxRawSockets](#demuxrawsockets)
- [Predicates](#predicates)
  - [isRawStreamSocket](#israwstreamsocket)
  - [responseIsRawStreamSocketResponse](#responseisrawstreamsocketresponse)
- [Type ids](#type-ids)
  - [RawStreamSocketTypeId](#rawstreamsockettypeid)
  - [RawStreamSocketTypeId (type alias)](#rawstreamsockettypeid-type-alias)
- [Types](#types)
  - [RawStreamSocketContentType](#rawstreamsocketcontenttype)

---

# Branded Types

## RawStreamSocket (type alias)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

**Signature**

```ts
export type RawStreamSocket = Socket.Socket & {
  readonly "content-type": typeof RawStreamSocketContentType
  readonly [RawStreamSocketTypeId]: typeof RawStreamSocketTypeId
}
```

Added in v1.0.0

# Constructors

## makeRawStreamSocket

**Signature**

```ts
export declare const makeRawStreamSocket: (socket: Socket.Socket) => RawStreamSocket
```

Added in v1.0.0

# Demux

## demuxRawSocket

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

To demux multiple raw sockets, you should use {@link demuxRawSockets}

**Signature**

```ts
export declare const demuxRawSocket: (<A1, E1, E2, R1, R2>(
  source: Stream.Stream<string | Uint8Array, E1, R1>,
  sink: Sink.Sink<A1, string, string, E2, R2>,
  options?: { encoding?: string | undefined } | undefined
) => (
  socket: RawStreamSocket
) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>) &
  (<A1, E1, E2, R1, R2>(
    socket: RawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>)
```

Added in v1.0.0

## demuxRawSockets

Demux multiple raw sockets, created from multiple container attach requests.
If no options are provided for a given stream, it will be ignored. This is
really just an Effect.all wrapper around {@link demuxRawSocket}.

To demux a single raw socket, you should use {@link demuxRawSocket}

**Signature**

```ts
export declare const demuxRawSockets: {
  <
    O1 extends readonly [Stream.Stream<string | Uint8Array, unknown, unknown>, RawStreamSocket],
    O2 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
    O3 extends readonly [RawStreamSocket, Sink.Sink<unknown, string, string, unknown, unknown>],
    E1 = O1 extends [Stream.Stream<string | Uint8Array, infer E, infer _R>, RawStreamSocket] ? E : never,
    E2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
    E3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer E, infer _R>] ? E : never,
    R1 = O1 extends [Stream.Stream<string | Uint8Array, infer _E, infer R>, RawStreamSocket] ? R : never,
    R2 = O2 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
    R3 = O3 extends [RawStreamSocket, Sink.Sink<infer _A, string, string, infer _E, infer R>] ? R : never,
    A1 = O2 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void,
    A2 = O3 extends [RawStreamSocket, Sink.Sink<infer A, string, string, infer _E, infer _R>] ? A : void
  >(
    sockets:
      | { stdin: O1; stdout?: never; stderr?: never }
      | { stdin?: never; stdout: O2; stderr?: never }
      | { stdin?: never; stdout?: never; stderr: O3 }
      | { stdin: O1; stdout: O2; stderr?: never }
      | { stdin: O1; stdout?: never; stderr: O3 }
      | { stdin?: never; stdout: O2; stderr: O3 }
      | { stdin: O1; stdout: O2; stderr: O3 },
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    sockets: Demux.StdinStdoutStderrSocketOptions,
    io: {
      stdin: Stream.Stream<string | Uint8Array, E1, R1>
      stdout: Sink.Sink<A1, string, string, E2, R2>
      stderr: Sink.Sink<A2, string, string, E3, R3>
    },
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    io: {
      stdin: Stream.Stream<string | Uint8Array, E1, R1>
      stdout: Sink.Sink<A1, string, string, E2, R2>
      stderr: Sink.Sink<A2, string, string, E3, R3>
    },
    options?: { encoding?: string | undefined } | undefined
  ): (
    sockets: Demux.StdinStdoutStderrSocketOptions
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, E1, E2, R1, R2>(
    sockets: Demux.StdinStdoutStderrSocketOptions,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): (
    sockets: Demux.StdinStdoutStderrSocketOptions
  ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
}
```

Added in v1.0.0

# Predicates

## isRawStreamSocket

**Signature**

```ts
export declare const isRawStreamSocket: (u: unknown) => u is RawStreamSocket
```

Added in v1.0.0

## responseIsRawStreamSocketResponse

**Signature**

```ts
export declare const responseIsRawStreamSocketResponse: (response: HttpClientResponse.HttpClientResponse) => boolean
```

Added in v1.0.0

# Type ids

## RawStreamSocketTypeId

**Signature**

```ts
export declare const RawStreamSocketTypeId: typeof RawStreamSocketTypeId
```

Added in v1.0.0

## RawStreamSocketTypeId (type alias)

**Signature**

```ts
export type RawStreamSocketTypeId = typeof RawStreamSocketTypeId
```

Added in v1.0.0

# Types

## RawStreamSocketContentType

**Signature**

```ts
export declare const RawStreamSocketContentType: "application/vnd.docker.raw-stream"
```

Added in v1.0.0
