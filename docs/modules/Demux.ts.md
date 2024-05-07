---
title: Demux.ts
nav_order: 4
parent: Modules
---

## Demux overview

Demux helpers

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Brands](#brands)
  - [MultiplexedStreamSocket](#multiplexedstreamsocket)
  - [RawStreamSocket](#rawstreamsocket)
- [Demux](#demux)
  - [demuxMultiplexedSocket](#demuxmultiplexedsocket)
  - [demuxRawSocket](#demuxrawsocket)
  - [demuxSocket](#demuxsocket)
  - [demuxSocketFromStdinToStdoutAndStderr](#demuxsocketfromstdintostdoutandstderr)
  - [responseToStreamingSocketOrFail](#responsetostreamingsocketorfail)
- [Errors](#errors)
  - [StderrError (class)](#stderrerror-class)
  - [StdinError (class)](#stdinerror-class)
  - [StdoutError (class)](#stdouterror-class)
- [Predicates](#predicates)
  - [isMultiplexedStreamSocketResponse](#ismultiplexedstreamsocketresponse)
  - [isRawStreamSocketResponse](#israwstreamsocketresponse)
- [Types](#types)
  - [MultiplexedStreamSocket (type alias)](#multiplexedstreamsocket-type-alias)
  - [RawStreamSocket (type alias)](#rawstreamsocket-type-alias)

---

# Brands

## MultiplexedStreamSocket

**Signature**

```ts
export declare const MultiplexedStreamSocket: Brand.Brand.Constructor<MultiplexedStreamSocket>
```

Added in v1.0.0

## RawStreamSocket

**Signature**

```ts
export declare const RawStreamSocket: Brand.Brand.Constructor<RawStreamSocket>
```

Added in v1.0.0

# Demux

## demuxMultiplexedSocket

Demux a multiplexed socket. When given a multiplexed socket, we must parse
the chunks by headers and then forward each chunk based on its datatype to
the correct sink.

{@link demuxSocket}

**Signature**

```ts
export declare const demuxMultiplexedSocket: (<A1, A2, E1, E2, E3>(
  source: Stream.Stream<Uint8Array, E1, never>,
  sink1: Sink.Sink<A1, string | Uint8Array, never, E2, never>,
  sink2: Sink.Sink<A2, string | Uint8Array, never, E3, never>
) => (
  socket: MultiplexedStreamSocket
) => Effect.Effect<readonly [stdout: A1, stderr: A2], Socket.SocketError | E1 | E2 | E3, never>) &
  (<A1, A2, E1, E2, E3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink1: Sink.Sink<A1, string | Uint8Array, never, E2, never>,
    sink2: Sink.Sink<A2, string | Uint8Array, never, E3, never>
  ) => Effect.Effect<readonly [stdout: A1, stderr: A2], Socket.SocketError | E1 | E2 | E3, never>)
```

Added in v1.0.0

## demuxRawSocket

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

{@link demuxSocket}

**Signature**

```ts
export declare const demuxRawSocket: (<A, E1, E2>(
  source: Stream.Stream<Uint8Array, E1, never>,
  sink: Sink.Sink<A, string | Uint8Array, never, E2, never>
) => (socket: RawStreamSocket) => Effect.Effect<A, Socket.SocketError | E1 | E2, never>) &
  (<A, E1, E2>(
    socket: RawStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink: Sink.Sink<A, string | Uint8Array, never, E2, never>
  ) => Effect.Effect<A, Socket.SocketError | E1 | E2, never>)
```

Added in v1.0.0

## demuxSocket

Demux an http socket. The source stream is the stream that you want to
forward to the containers stdin. If the socket is a raw stream, then there
will only be one sink that combines the containers stdout and stderr. if the
socket is a multiplexed stream, then there will be two sinks, one for stdout
and one for stderr.

**Signature**

```ts
export declare const demuxSocket: {
  <A1, E1, E2>(
    socket: RawStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink: Sink.Sink<A1, string | Uint8Array, never, E2, never>
  ): Effect.Effect<A1, Socket.SocketError | E1 | E2, never>
  <A1, E1, E2>(
    source: Stream.Stream<Uint8Array, E1, never>,
    sink: Sink.Sink<A1, string | Uint8Array, never, E2, never>
  ): (socket: RawStreamSocket) => Effect.Effect<A1, Socket.SocketError | E1 | E2, never>
  <A1, A2, E1, E2, E3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink1: Sink.Sink<A1, string | Uint8Array, never, E2, never>,
    sink2: Sink.Sink<A2, string | Uint8Array, never, E3, never>
  ): Effect.Effect<readonly [stdout: A1, stderr: A2], Socket.SocketError | E1 | E2 | E3, never>
  <A1, A2, E1, E2, E3>(
    source: Stream.Stream<Uint8Array, E1, never>,
    sink1: Sink.Sink<A1, string | Uint8Array, never, E2, never>,
    sink2: Sink.Sink<A2, string | Uint8Array, never, E3, never>
  ): (
    socket: MultiplexedStreamSocket
  ) => Effect.Effect<readonly [stdout: A1, stderr: A2], Socket.SocketError | E1 | E2 | E3, never>
}
```

Added in v1.0.0

## demuxSocketFromStdinToStdoutAndStderr

Demux either a raw stream socket or a multiplexed stream socket from stdin to
stdout and stderr. If given a raw stream socket, then stdout and stderr will
be combined on the same sink. If given a multiplexed stream socket, then
stdout and stderr will be forwarded to different sinks.

**Signature**

```ts
export declare const demuxSocketFromStdinToStdoutAndStderr: (
  socket: RawStreamSocket | MultiplexedStreamSocket
) => Effect.Effect<void, Socket.SocketError | StdinError | StdoutError | StderrError, never>
```

Added in v1.0.0

## responseToStreamingSocketOrFail

Transforms an http response into a multiplexed stream socket or a raw stream
socket. If the response is neither a multiplexed stream socket nor a raw,
then an error will be returned.

**Signature**

```ts
export declare const responseToStreamingSocketOrFail: (
  response: HttpClient.response.ClientResponse
) => Effect.Effect<RawStreamSocket | MultiplexedStreamSocket, Socket.SocketError, never>
```

Added in v1.0.0

# Errors

## StderrError (class)

**Signature**

```ts
export declare class StderrError
```

Added in v1.0.0

## StdinError (class)

**Signature**

```ts
export declare class StdinError
```

Added in v1.0.0

## StdoutError (class)

**Signature**

```ts
export declare class StdoutError
```

Added in v1.0.0

# Predicates

## isMultiplexedStreamSocketResponse

**Signature**

```ts
export declare const isMultiplexedStreamSocketResponse: (response: HttpClient.response.ClientResponse) => boolean
```

Added in v1.0.0

## isRawStreamSocketResponse

**Signature**

```ts
export declare const isRawStreamSocketResponse: (response: HttpClient.response.ClientResponse) => boolean
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
  "content-type": "application/vnd.docker.multiplexed-stream"
} & Brand.Brand<"MultiplexedStreamSocket">
```

Added in v1.0.0

## RawStreamSocket (type alias)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

**Signature**

```ts
export type RawStreamSocket = Socket.Socket & {
  "content-type": "application/vnd.docker.raw-stream"
} & Brand.Brand<"RawStreamSocket">
```

Added in v1.0.0
