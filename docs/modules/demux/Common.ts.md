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

Demux a bidirectional socket. The source stream is the stream that you want
to forward to the containers stdin. If the socket is a raw stream, then there
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
stdout and stderr. If given a bidirectional raw stream socket, then stdout
and stderr will be combined on the same sink. If given a multiplexed stream
socket, then stdout and stderr will be forwarded to different sinks. If given
a unidirectional raw stream socket, then you are only required to provide one
for stdout but can also provide sockets for stdin and stderr as well.

If you are looking for a way to demux to the console instead of stdin,
stdout, and stderr then see {@link demuxSocketWithInputToConsole}.

Since we are interacting with stdin, stdout, and stderr this function
dynamically imports the `@effect/platform-node` package.

**Signature**

```ts
export declare const demuxSocketFromStdinToStdoutAndStderr: <
  UnidirectionalSocketOptions extends {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
  },
  SocketOptions extends BidirectionalRawStreamSocket | MultiplexedStreamSocket | UnidirectionalSocketOptions,
  E1 extends SocketOptions extends MultiplexedStreamSocket ? ParseResult.ParseError : never
>(
  socketOptions: SocketOptions
) => NeedsPlatformNode<Effect.Effect<void, Socket.SocketError | E1 | StdinError | StdoutError | StderrError, never>>
```

Added in v1.0.0

## demuxSocketWithInputToConsole

Demux either a raw stream socket or a multiplexed stream socket to the
console. If given a bidirectional raw stream socket, then stdout and stderr
will be combined on the same sink. If given a multiplexed stream socket, then
stdout and stderr will be forwarded to different sinks. If given a
unidirectional raw stream socket, then you are only required to provide one
for stdout but can also provide sockets for stdin and stderr as well.

If you are looking for a way to demux to stdin, stdout, and stderr instead of
the console then see {@link demuxSocketFromStdinToStdoutAndStderr}.

**Signature**

```ts
export declare const demuxSocketWithInputToConsole: <
  UnidirectionalSocketOptions extends {
    stdout: UnidirectionalRawStreamSocket
    stdin?: UnidirectionalRawStreamSocket | undefined
    stderr?: UnidirectionalRawStreamSocket | undefined
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
socket. If the response is neither a multiplexed stream socket nor a raw or
can not be transformed, then an error will be returned.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
export declare const responseToStreamingSocketOrFail: (<
  SourceIsKnownUnidirectional extends true | undefined = undefined
>(
  options?: { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional } | undefined
) => (
  response: HttpClientResponse.HttpClientResponse
) => NeedsPlatformNode<
  Effect.Effect<
    SourceIsKnownUnidirectional extends true
      ? UnidirectionalRawStreamSocket
      : BidirectionalRawStreamSocket | MultiplexedStreamSocket,
    Socket.SocketError,
    never
  >
>) &
  (<SourceIsKnownUnidirectional extends true | undefined = undefined>(
    response: HttpClientResponse.HttpClientResponse,
    options?: { sourceIsKnownUnidirectional: SourceIsKnownUnidirectional } | undefined
  ) => NeedsPlatformNode<
    Effect.Effect<
      SourceIsKnownUnidirectional extends true
        ? UnidirectionalRawStreamSocket
        : BidirectionalRawStreamSocket | MultiplexedStreamSocket,
      Socket.SocketError,
      never
    >
  >)
```

Added in v1.0.0
