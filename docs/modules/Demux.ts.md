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
  - [demuxBidirectionalRawSocket](#demuxbidirectionalrawsocket)
  - [demuxBidirectionalSocket](#demuxbidirectionalsocket)
  - [demuxMultiplexedSocket](#demuxmultiplexedsocket)
  - [demuxSocketFromStdinToStdoutAndStderr](#demuxsocketfromstdintostdoutandstderr)
  - [demuxSocketWithInputToConsole](#demuxsocketwithinputtoconsole)

---

# Demux

## demuxBidirectionalRawSocket

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

To demux multiple raw sockets, you should use {@link demuxRawSockets}

**Signature**

```ts
export declare const demuxBidirectionalRawSocket: (<A1, E1, E2, R1, R2>(
  source: Stream<string | Uint8Array, E1, R1>,
  sink: Sink<A1, string, string, E2, R2>
) => (
  socket: rawInternal.BidirectionalRawStreamSocket
) => Effect<A1, SocketError | E1 | E2, Exclude<R1, Scope> | Exclude<R2, Scope>>) &
  (<A1, E1, E2, R1, R2>(
    socket: rawInternal.BidirectionalRawStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>
  ) => Effect<A1, SocketError | E1 | E2, Exclude<R1, Scope> | Exclude<R2, Scope>>)
```

Added in v1.0.0

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
    socket: rawInternal.BidirectionalRawStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>
  ): Effect<A1, SocketError | E1 | E2, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, E1, E2, R1, R2>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink: Sink<A1, string, string, E2, R2>
  ): (
    socket: rawInternal.BidirectionalRawStreamSocket
  ) => Effect<A1, SocketError | E1 | E2, Exclude<R1, Scope> | Exclude<R2, Scope>>
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: multiplexedInternal.MultiplexedStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined } | undefined
  ): Effect<
    CompressedDemuxOutput<A1, A2>,
    SocketError | E1 | E2 | E3 | ParseError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
  <A1, A2, E1, E2, E3, R1, R2, R3>(
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined } | undefined
  ): (
    socket: multiplexedInternal.MultiplexedStreamSocket
  ) => Effect<
    CompressedDemuxOutput<A1, A2>,
    SocketError | E1 | E2 | E3 | ParseError,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >
}
```

Added in v1.0.0

## demuxMultiplexedSocket

Demux a multiplexed socket. When given a multiplexed socket, we must parse
the chunks by headers and then forward each chunk based on its datatype to
the correct sink.

When partitioning the stream into stdout and stderr, the first sink may
advance by up to bufferSize elements further than the slower one. The default
bufferSize is 16.

**Signature**

```ts
export declare const demuxMultiplexedSocket: (<A1, A2, E1, E2, E3, R1, R2, R3>(
  source: Stream<string | Uint8Array, E1, R1>,
  sink1: Sink<A1, string, string, E2, R2>,
  sink2: Sink<A2, string, string, E3, R3>,
  options?: { bufferSize?: number | undefined } | undefined
) => (
  socket: multiplexedInternal.MultiplexedStreamSocket
) => Effect<
  CompressedDemuxOutput<A1, A2>,
  SocketError | ParseError | E1 | E2 | E3,
  Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
>) &
  (<A1, A2, E1, E2, E3, R1, R2, R3>(
    socket: multiplexedInternal.MultiplexedStreamSocket,
    source: Stream<string | Uint8Array, E1, R1>,
    sink1: Sink<A1, string, string, E2, R2>,
    sink2: Sink<A2, string, string, E3, R3>,
    options?: { bufferSize?: number | undefined } | undefined
  ) => Effect<
    CompressedDemuxOutput<A1, A2>,
    SocketError | ParseError | E1 | E2 | E3,
    Exclude<R1, Scope> | Exclude<R2, Scope> | Exclude<R3, Scope>
  >)
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
    stdin: rawInternal.UnidirectionalRawStreamSocket
    stdout: rawInternal.UnidirectionalRawStreamSocket
    stderr: rawInternal.UnidirectionalRawStreamSocket
  },
  SocketOptions extends
    | multiplexedInternal.MultiplexedStreamSocket
    | rawInternal.BidirectionalRawStreamSocket
    | UnidirectionalSocketOptions,
  E1 extends SocketOptions extends multiplexedInternal.MultiplexedStreamSocket ? ParseError : never
>(
  socketOptions: SocketOptions
) => Effect<
  void,
  SocketError | E1 | commonInternal.StdinError | commonInternal.StdoutError | commonInternal.StderrError,
  never
>
```

Added in v1.0.0

## demuxSocketWithInputToConsole

Demux either a raw stream socket or a multiplexed stream socket. It will send
the input stream to the container and will log all output to the console.

**Signature**

```ts
export declare const demuxSocketWithInputToConsole: <
  UnidirectionalSocketOptions extends {
    stdin: rawInternal.UnidirectionalRawStreamSocket
    stdout: rawInternal.UnidirectionalRawStreamSocket
    stderr: rawInternal.UnidirectionalRawStreamSocket
  },
  SocketOptions extends
    | multiplexedInternal.MultiplexedStreamSocket
    | rawInternal.BidirectionalRawStreamSocket
    | UnidirectionalSocketOptions,
  E2 extends SocketOptions extends multiplexedInternal.MultiplexedStreamSocket ? ParseError : never,
  E1,
  R1
>(
  input: Stream<string | Uint8Array, E1, R1>,
  socketOptions: SocketOptions
) => Effect<void, SocketError | E2 | E1, Exclude<R1, Scope>>
```

Added in v1.0.0
