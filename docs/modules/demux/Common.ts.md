---
title: demux/Common.ts
nav_order: 3
parent: Modules
---

## Common overview

Common demux utilities for hijacked docker streams.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Demux](#demux)
  - [demuxBidirectionalSocket](#demuxbidirectionalsocket)
  - [demuxSocketFromStdinToStdoutAndStderr](#demuxsocketfromstdintostdoutandstderr)
  - [demuxSocketWithInputToConsole](#demuxsocketwithinputtoconsole)
- [Errors](#errors)
  - [StderrError (class)](#stderrerror-class)
  - [StdinError (class)](#stdinerror-class)
  - [StdoutError (class)](#stdouterror-class)
- [Predicates](#predicates)
  - [responseToStreamingSocketOrFail](#responsetostreamingsocketorfail)

---

# Demux

## demuxBidirectionalSocket

Demux an http socket. The source stream is the stream that you want to
forward to the containers stdin. If the socket is a raw stream, then there
will only be one sink that combines the containers stdout and stderr. if the
socket is a multiplexed stream, then there will be two sinks, one for stdout
and one for stderr.

**Signature**

```ts
export declare const demuxBidirectionalSocket: {
  <A1, E1, E2, R1, R2>(
    socket: BidirectionalRawStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>
  ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, string, E2, R2>
  ): (
    socket: BidirectionalRawStreamSocket
  ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: MultiplexedStreamSocket,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined } | undefined
  ): Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | Socket.SocketError | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink1: Sink.Sink<A1, string, string, E2, R2>,
    sink2: Sink.Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined } | undefined
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

## demuxSocketFromStdinToStdoutAndStderr

Demux either a raw stream socket or a multiplexed stream socket from stdin to
stdout and stderr. If given a raw stream socket, then stdout and stderr will
be combined on the same sink. If given a multiplexed stream socket, then
stdout and stderr will be forwarded to different sinks.

**Signature**

```ts
export declare const demuxSocketFromStdinToStdoutAndStderr: <
  UnidirectionalSocketOptions extends {
    stdin: UnidirectionalRawStreamSocket
    stdout: UnidirectionalRawStreamSocket
    stderr: UnidirectionalRawStreamSocket
  },
  SocketOptions extends BidirectionalRawStreamSocket | MultiplexedStreamSocket | UnidirectionalSocketOptions,
  E1 extends SocketOptions extends MultiplexedStreamSocket ? ParseResult.ParseError : never
>(
  socketOptions: SocketOptions
) => Effect.Effect<void, Socket.SocketError | E1 | StdinError | StdoutError | StderrError, never>
```

Added in v1.0.0

## demuxSocketWithInputToConsole

Demux either a raw stream socket or a multiplexed stream socket. It will send
the input stream to the container and will log all output to the console.

**Signature**

```ts
export declare const demuxSocketWithInputToConsole: <
  UnidirectionalSocketOptions extends {
    stdin: UnidirectionalRawStreamSocket
    stdout: UnidirectionalRawStreamSocket
    stderr: UnidirectionalRawStreamSocket
  },
  SocketOptions extends BidirectionalRawStreamSocket | MultiplexedStreamSocket | UnidirectionalSocketOptions,
  E2 extends SocketOptions extends MultiplexedStreamSocket ? ParseResult.ParseError : never,
  E1,
  R1
>(
  input: Stream.Stream<string | Uint8Array, E1, R1>,
  socketOptions: SocketOptions
) => Effect.Effect<void, E1 | E2 | Socket.SocketError, Exclude<R1, Scope.Scope>>
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

## responseToStreamingSocketOrFail

Transforms an http response into a multiplexed stream socket or a raw stream
socket. If the response is neither a multiplexed stream socket nor a raw,
then an error will be returned.

**Signature**

```ts
export declare const responseToStreamingSocketOrFail: (<
  SourceIsKnownUnidirectional extends true | undefined = undefined
>(
  options?: { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional } | undefined
) => (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<
  SourceIsKnownUnidirectional extends true
    ? UnidirectionalRawStreamSocket
    : BidirectionalRawStreamSocket | MultiplexedStreamSocket,
  Socket.SocketError,
  never
>) &
  (<SourceIsKnownUnidirectional extends true | undefined = undefined>(
    response: HttpClientResponse.HttpClientResponse,
    options?: { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional } | undefined
  ) => Effect.Effect<
    SourceIsKnownUnidirectional extends true
      ? UnidirectionalRawStreamSocket
      : BidirectionalRawStreamSocket | MultiplexedStreamSocket,
    Socket.SocketError,
    never
  >)
```

Added in v1.0.0
