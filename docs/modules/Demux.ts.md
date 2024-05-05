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

- [utils](#utils)
  - [MultiplexedStreamSocket](#multiplexedstreamsocket)
  - [MultiplexedStreamSocket (type alias)](#multiplexedstreamsocket-type-alias)
  - [RawStreamSocket](#rawstreamsocket)
  - [RawStreamSocket (type alias)](#rawstreamsocket-type-alias)
  - [StderrError (class)](#stderrerror-class)
  - [StdinError (class)](#stdinerror-class)
  - [StdoutError (class)](#stdouterror-class)
  - [demuxMultiplexedSocket](#demuxmultiplexedsocket)
  - [demuxRawSocket](#demuxrawsocket)
  - [demuxSocket](#demuxsocket)
  - [demuxSocketFromStdinToStdoutAndStderr](#demuxsocketfromstdintostdoutandstderr)
  - [isMultiplexedStreamSocketResponse](#ismultiplexedstreamsocketresponse)
  - [isRawStreamSocketResponse](#israwstreamsocketresponse)
  - [responseToStreamingSocketOrFail](#responsetostreamingsocketorfail)

---

# utils

## MultiplexedStreamSocket

**Signature**

```ts
export declare const MultiplexedStreamSocket: Brand.Brand.Constructor<MultiplexedStreamSocket>
```

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

## RawStreamSocket

**Signature**

```ts
export declare const RawStreamSocket: Brand.Brand.Constructor<RawStreamSocket>
```

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

## StderrError (class)

**Signature**

```ts
export declare class StderrError
```

## StdinError (class)

**Signature**

```ts
export declare class StdinError
```

## StdoutError (class)

**Signature**

```ts
export declare class StdoutError
```

## demuxMultiplexedSocket

Demux a multiplexed socket. When given a multiplexed socket, we must parse
the chunks by headers and then forward each chunk based on its datatype to
the correct sink.

{@link demuxSocket}

**Signature**

```ts
export declare const demuxMultiplexedSocket: (<E1, E2, E3>(
  source: Stream.Stream<Uint8Array, E1, never>,
  sink1: Sink.Sink<void, string | Uint8Array, never, E2, never>,
  sink2: Sink.Sink<void, string | Uint8Array, never, E3, never>
) => (socket: MultiplexedStreamSocket) => Effect.Effect<void, Socket.SocketError | E1 | E2 | E3, never>) &
  (<E1, E2, E3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink1: Sink.Sink<void, string | Uint8Array, never, E2, never>,
    sink2: Sink.Sink<void, string | Uint8Array, never, E3, never>
  ) => Effect.Effect<void, Socket.SocketError | E1 | E2 | E3, never>)
```

## demuxRawSocket

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

{@link demuxSocket}

**Signature**

```ts
export declare const demuxRawSocket: (<E1, E2>(
  source: Stream.Stream<Uint8Array, E1, never>,
  sink: Sink.Sink<void, string | Uint8Array, never, E2, never>
) => (socket: RawStreamSocket) => Effect.Effect<void, Socket.SocketError | E1 | E2, never>) &
  (<E1, E2>(
    socket: RawStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink: Sink.Sink<void, string | Uint8Array, never, E2, never>
  ) => Effect.Effect<void, Socket.SocketError | E1 | E2, never>)
```

## demuxSocket

Demux an http socket. The source stream is the stream that you want to
forward to the containers stdin. If the socket is a raw stream, then there
will only be one sink that combines the containers stdout and stderr. if the
socket is a multiplexed stream, then there will be two sinks, one for stdout
and one for stderr.

**Signature**

```ts
export declare const demuxSocket: {
  <E1, E2>(
    socket: RawStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink: Sink.Sink<void, string | Uint8Array, never, E2, never>
  ): Effect.Effect<void, Socket.SocketError | E1 | E2, never>
  <E1, E2>(
    source: Stream.Stream<Uint8Array, E1, never>,
    sink: Sink.Sink<void, string | Uint8Array, never, E2, never>
  ): (socket: RawStreamSocket) => Effect.Effect<void, Socket.SocketError | E1 | E2, never>
  <E1, E2, E3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<Uint8Array, E1, never>,
    sink1: Sink.Sink<void, string | Uint8Array, never, E2, never>,
    sink2: Sink.Sink<void, string | Uint8Array, never, E3, never>
  ): Effect.Effect<void, Socket.SocketError | E1 | E2 | E3, never>
  <E1, E2, E3>(
    source: Stream.Stream<Uint8Array, E1, never>,
    sink1: Sink.Sink<void, string | Uint8Array, never, E2, never>,
    sink2: Sink.Sink<void, string | Uint8Array, never, E3, never>
  ): (socket: MultiplexedStreamSocket) => Effect.Effect<void, Socket.SocketError | E1 | E2 | E3, never>
}
```

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

## isMultiplexedStreamSocketResponse

**Signature**

```ts
export declare const isMultiplexedStreamSocketResponse: (response: HttpClient.response.ClientResponse) => boolean
```

## isRawStreamSocketResponse

**Signature**

```ts
export declare const isRawStreamSocketResponse: (response: HttpClient.response.ClientResponse) => boolean
```

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
