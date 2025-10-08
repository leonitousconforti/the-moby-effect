---
title: MobyDemux.ts
nav_order: 8
parent: Modules
---

## MobyDemux.ts overview

Demux utilities for different types of docker streams.

Since v1.0.0

---

## Exports Grouped by Category

- [Branded Types](#branded-types)
  - [MultiplexedChannel (interface)](#multiplexedchannel-interface)
  - [MultiplexedSocket (interface)](#multiplexedsocket-interface)
  - [RawChannel (interface)](#rawchannel-interface)
  - [RawSocket (interface)](#rawsocket-interface)
- [Constructors](#constructors)
  - [makeMultiplexedChannel](#makemultiplexedchannel)
  - [makeMultiplexedSocket](#makemultiplexedsocket)
  - [makeRawChannel](#makerawchannel)
  - [makeRawSocket](#makerawsocket)
- [Conversions](#conversions)
  - [asMultiplexedChannel](#asmultiplexedchannel)
  - [asRawChannel](#asrawchannel)
  - [interleaveRaw](#interleaveraw)
  - [mergeRawToTaggedStream](#mergerawtotaggedstream)
  - [multiplexedFromSink](#multiplexedfromsink)
  - [multiplexedFromStream](#multiplexedfromstream)
  - [multiplexedFromStreamWith](#multiplexedfromstreamwith)
  - [multiplexedToSink](#multiplexedtosink)
  - [multiplexedToStream](#multiplexedtostream)
  - [rawFromSink](#rawfromsink)
  - [rawFromStream](#rawfromstream)
  - [rawFromStreamWith](#rawfromstreamwith)
  - [rawToSink](#rawtosink)
  - [rawToStream](#rawtostream)
- [Demux](#demux)
  - [demuxMultiplexedToSeparateSinks](#demuxmultiplexedtoseparatesinks)
  - [demuxMultiplexedToSingleSink](#demuxmultiplexedtosinglesink)
  - [demuxRawToSingleSink](#demuxrawtosinglesink)
  - [demuxStdioRawToSeparateSinks](#demuxstdiorawtoseparatesinks)
  - [demuxStdioRawToSingleSink](#demuxstdiorawtosinglesink)
  - [demuxStdioRawTupled](#demuxstdiorawtupled)
  - [demuxToSingleSink](#demuxtosinglesink)
- [DemuxStdio](#demuxstdio)
  - [demuxFromStdinToStdoutAndStderr](#demuxfromstdintostdoutandstderr)
  - [demuxWithInputToConsole](#demuxwithinputtoconsole)
- [Fanning](#fanning)
  - [fan](#fan)
- [Packing](#packing)
  - [pack](#pack)
- [Predicates](#predicates)
  - [isMultiplexedChannel](#ismultiplexedchannel)
  - [isMultiplexedSocket](#ismultiplexedsocket)
  - [isRawChannel](#israwchannel)
  - [isRawSocket](#israwsocket)
  - [responseIsMultiplexedResponse](#responseismultiplexedresponse)
  - [responseIsRawResponse](#responseisrawresponse)
  - [responseToStreamingSocketOrFailUnsafe](#responsetostreamingsocketorfailunsafe)
- [Transformations](#transformations)
  - [hijackResponseUnsafe](#hijackresponseunsafe)
- [Type ids](#type-ids)
  - [MultiplexedChannelTypeId](#multiplexedchanneltypeid)
  - [MultiplexedChannelTypeId (type alias)](#multiplexedchanneltypeid-type-alias)
  - [MultiplexedSocketTypeId](#multiplexedsockettypeid)
  - [MultiplexedSocketTypeId (type alias)](#multiplexedsockettypeid-type-alias)
  - [RawChannelTypeId](#rawchanneltypeid)
  - [RawChannelTypeId (type alias)](#rawchanneltypeid-type-alias)
  - [RawSocketTypeId](#rawsockettypeid)
  - [RawSocketTypeId (type alias)](#rawsockettypeid-type-alias)
- [Types](#types)
  - [AnyMultiplexedInput (type alias)](#anymultiplexedinput-type-alias)
  - [AnyRawInput (type alias)](#anyrawinput-type-alias)
  - [CompressedDemuxOutput (type alias)](#compresseddemuxoutput-type-alias)
  - [EitherMultiplexedInput (type alias)](#eithermultiplexedinput-type-alias)
  - [EitherRawInput (type alias)](#eitherrawinput-type-alias)
  - [HeterogeneousStdioRawInput (type alias)](#heterogeneousstdiorawinput-type-alias)
  - [HeterogeneousStdioTupledRawInput (type alias)](#heterogeneousstdiotupledrawinput-type-alias)
  - [HomogeneousStdioRawChannelInput (type alias)](#homogeneousstdiorawchannelinput-type-alias)
  - [HomogeneousStdioRawSocketInput (type alias)](#homogeneousstdiorawsocketinput-type-alias)
  - [MultiplexedContentType](#multiplexedcontenttype)
  - [RawContentType](#rawcontenttype)

---

# Branded Types

## MultiplexedChannel (interface)

When the TTY setting is disabled in POST /containers/create, the HTTP
Content-Type header is set to application/vnd.docker.multiplexed-stream and
the stream over the hijacked connected is multiplexed to separate out stdout
and stderr. The stream consists of a series of frames, each containing a
header and a payload.

Note for Leo: This exists because there is no way to convert from a Channel
to a Socket. In fact, with my current effect knowledge, I believe it is
impossible to implement. This is still needed though for the pack and fan
implementations which seek to return these types.

**Signature**

```ts
export interface MultiplexedChannel<in IE = unknown, out OE = Socket.SocketError, out R = never>
  extends Pipeable.Pipeable {
  readonly "content-type": typeof MultiplexedContentType
  readonly [MultiplexedChannelTypeId]: MultiplexedChannelTypeId
  readonly underlying: Channel.Channel<
    Chunk.Chunk<Uint8Array>,
    Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
    OE,
    IE,
    void,
    unknown,
    R
  >
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L166)

Since v1.0.0

## MultiplexedSocket (interface)

When the TTY setting is disabled in POST /containers/create, the HTTP
Content-Type header is set to application/vnd.docker.multiplexed-stream and
the stream over the hijacked connected is multiplexed to separate out stdout
and stderr. The stream consists of a series of frames, each containing a
header and a payload.

Note for Leo: This exists because the input error type "IE" might not be
known at the time of converting the Socket to a Channel.

**Signature**

```ts
export interface MultiplexedSocket extends Pipeable.Pipeable {
  readonly "content-type": typeof MultiplexedContentType
  readonly [MultiplexedSocketTypeId]: MultiplexedSocketTypeId
  readonly underlying: Socket.Socket
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L145)

Since v1.0.0

## RawChannel (interface)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

Note for Leo: This exists because there is no way to convert from a Channel
to a Socket. In fact, with my current effect knowledge, I believe it is
impossible to implement. This is still needed though for the pack and fan
implementations which seek to return these types.

**Signature**

```ts
export interface RawChannel<in IE = unknown, out OE = Socket.SocketError, out R = never> extends Pipeable.Pipeable {
  readonly "content-type": typeof RawContentType
  readonly [RawChannelTypeId]: typeof RawChannelTypeId
  readonly underlying: Channel.Channel<
    Chunk.Chunk<Uint8Array>,
    Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
    OE,
    IE,
    void,
    unknown,
    R
  >
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L118)

Since v1.0.0

## RawSocket (interface)

When the TTY setting is enabled in POST /containers/create, the stream is not
multiplexed. The data exchanged over the hijacked connection is simply the
raw data from the process PTY and client's stdin.

Note for Leo: This exists because the input error type "IE" might not be
known at the time of converting the Socket to a Channel.

**Signature**

```ts
export interface RawSocket extends Pipeable.Pipeable {
  readonly "content-type": typeof RawContentType
  readonly [RawSocketTypeId]: typeof RawSocketTypeId
  readonly underlying: Socket.Socket
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L99)

Since v1.0.0

# Constructors

## makeMultiplexedChannel

**Signature**

```ts
declare const makeMultiplexedChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
  underlying: Channel.Channel<
    Chunk.Chunk<Uint8Array>,
    Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
    OE,
    IE,
    void,
    unknown,
    R
  >
) => MultiplexedChannel<IE, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L367)

Since v1.0.0

## makeMultiplexedSocket

**Signature**

```ts
declare const makeMultiplexedSocket: (underlying: Socket.Socket) => MultiplexedSocket
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L360)

Since v1.0.0

## makeRawChannel

**Signature**

```ts
declare const makeRawChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
  underlying: Channel.Channel<
    Chunk.Chunk<Uint8Array>,
    Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
    OE,
    IE,
    void,
    unknown,
    R
  >
) => RawChannel<IE, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L344)

Since v1.0.0

## makeRawSocket

**Signature**

```ts
declare const makeRawSocket: (underlying: Socket.Socket) => RawSocket
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L338)

Since v1.0.0

# Conversions

## asMultiplexedChannel

**Signature**

```ts
declare const asMultiplexedChannel: <IE = never, OE = Socket.SocketError, R = never>(
  input: EitherMultiplexedInput<IE, OE, R>
) => MultiplexedChannel<IE, OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L464)

Since v1.0.0

## asRawChannel

**Signature**

```ts
declare const asRawChannel: <IE = never, OE = Socket.SocketError, R = never>(
  input: EitherRawInput<IE, OE, R>
) => RawChannel<IE, OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L456)

Since v1.0.0

## interleaveRaw

**Signature**

```ts
declare const interleaveRaw: <
  IE1 = never,
  IE2 = never,
  OE1 = Socket.SocketError,
  OE2 = Socket.SocketError,
  R1 = never,
  R2 = never
>(
  stdout: EitherRawInput<IE1, OE1, R1>,
  stderr: EitherRawInput<IE2, OE2, R2>
) => Stream.Stream<Uint8Array, IE1 | IE2 | OE1 | OE2, R1 | R2>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L551)

Since v1.0.0

## mergeRawToTaggedStream

**Signature**

```ts
declare const mergeRawToTaggedStream: <
  IE1 = never,
  IE2 = never,
  OE1 = Socket.SocketError,
  OE2 = Socket.SocketError,
  R1 = never,
  R2 = never
>(
  stdout: EitherRawInput<IE1, OE1, R1>,
  stderr: EitherRawInput<IE2, OE2, R2>,
  options?: { bufferSize?: number | undefined } | undefined
) => Stream.Stream<
  { _tag: "stdout"; value: Uint8Array } | { _tag: "stderr"; value: Uint8Array },
  IE1 | IE2 | OE1 | OE2,
  R1 | R2
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L567)

Since v1.0.0

## multiplexedFromSink

**Signature**

```ts
declare const multiplexedFromSink: <E, R>(
  input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
) => MultiplexedChannel<never, E, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L543)

Since v1.0.0

## multiplexedFromStream

**Signature**

```ts
declare const multiplexedFromStream: <E, R>(input: Stream.Stream<Uint8Array, E, R>) => MultiplexedChannel<never, E, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L528)

Since v1.0.0

## multiplexedFromStreamWith

**Signature**

```ts
declare const multiplexedFromStreamWith: <IE>() => <E, R>(
  input: Stream.Stream<Uint8Array, IE | E, R>
) => MultiplexedChannel<IE, IE | E, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L513)

Since v1.0.0

## multiplexedToSink

**Signature**

```ts
declare const multiplexedToSink: <IE = never, OE = Socket.SocketError, R = never>(
  input: EitherMultiplexedInput<IE, OE, R>
) => Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L496)

Since v1.0.0

## multiplexedToStream

**Signature**

```ts
declare const multiplexedToStream: <IE = never, OE = Socket.SocketError, R = never>(
  input: EitherMultiplexedInput<IE, OE, R>
) => Stream.Stream<Uint8Array, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L480)

Since v1.0.0

## rawFromSink

**Signature**

```ts
declare const rawFromSink: <E, R>(
  input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
) => RawChannel<never, E, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L535)

Since v1.0.0

## rawFromStream

**Signature**

```ts
declare const rawFromStream: <E, R>(input: Stream.Stream<Uint8Array, E, R>) => RawChannel<never, E, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L521)

Since v1.0.0

## rawFromStreamWith

**Signature**

```ts
declare const rawFromStreamWith: <IE>() => <E, R>(
  input: Stream.Stream<Uint8Array, IE | E, R>
) => RawChannel<IE, IE | E, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L505)

Since v1.0.0

## rawToSink

**Signature**

```ts
declare const rawToSink: <IE = never, OE = Socket.SocketError, R = never>(
  input: EitherRawInput<IE, OE, R>
) => Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L488)

Since v1.0.0

## rawToStream

**Signature**

```ts
declare const rawToStream: <IE = never, OE = Socket.SocketError, R = never>(
  input: EitherRawInput<IE, OE, R>
) => Stream.Stream<Uint8Array, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L472)

Since v1.0.0

# Demux

## demuxMultiplexedToSeparateSinks

Demux a multiplexed socket. When given a multiplexed socket, we must parse
the chunks by headers and then forward each chunk based on its datatype to
the correct sink.

When partitioning the stream into stdout and stderr, the first sink may
advance by up to bufferSize elements further than the slower one. The default
bufferSize is 16.

**Signature**

```ts
declare const demuxMultiplexedToSeparateSinks: (<A1, A2, L1, L2, E1, E2, E3, R1, R2, R3>(
  source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
  sink1: Sink.Sink<A1, string, L1, E2, R2>,
  sink2: Sink.Sink<A2, string, L2, E3, R3>,
  options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => <IE = never, OE = Socket.SocketError, R4 = never>(
  socket: EitherMultiplexedInput<E1 | IE, OE, R4>
) => Effect.Effect<
  CompressedDemuxOutput<A1, A2>,
  E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
  Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
>) &
  (<A1, A2, L1, L2, E1, E2, E3, R1, R2, R3, IE = never, OE = Socket.SocketError, R4 = never>(
    socket: EitherMultiplexedInput<E1 | IE, OE, R4>,
    source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
    sink1: Sink.Sink<A1, string, L1, E2, R2>,
    sink2: Sink.Sink<A2, string, L2, E3, R3>,
    options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | IE | OE | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope> | Exclude<R4, Scope.Scope>
  >)
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L661)

Since v1.0.0

## demuxMultiplexedToSingleSink

Demux a multiplexed socket, all output goes to a single sink.

**Signature**

```ts
declare const demuxMultiplexedToSingleSink: (<A1, L1, E1, E2, R1, R2>(
  source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
  sink: Sink.Sink<A1, readonly [internalMultiplexed.MultiplexedHeaderType, string], L1, E2, R2>,
  options?: { encoding?: string | undefined } | undefined
) => <IE = never, OE = Socket.SocketError, R3 = never>(
  socket: EitherMultiplexedInput<E1 | IE, OE, R3>
) => Effect.Effect<
  A1,
  E1 | E2 | IE | OE | ParseResult.ParseError,
  Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
>) &
  (<A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
    socket: EitherMultiplexedInput<E1 | IE, OE, R3>,
    source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
    sink: Sink.Sink<A1, readonly [internalMultiplexed.MultiplexedHeaderType, string], L1, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ) => Effect.Effect<
    A1,
    E1 | E2 | IE | OE | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >)
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L647)

Since v1.0.0

## demuxRawToSingleSink

Demux a raw socket. When given a raw socket of the remote process's pty,
there is no way to differentiate between stdout and stderr so they are
combined on the same sink.

**Signature**

```ts
declare const demuxRawToSingleSink: (<A1, L1, E1, E2, R1, R2>(
  source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
  sink: Sink.Sink<A1, string, L1, E2, R2>,
  options?: { encoding?: string | undefined } | undefined
) => <IE = never, OE = Socket.SocketError, R3 = never>(
  socket: EitherRawInput<E1 | IE, OE, R3>
) => Effect.Effect<
  A1,
  E1 | E2 | IE | OE,
  Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
>) &
  (<A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
    socket: EitherRawInput<E1 | IE, OE, R3>,
    source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
    sink: Sink.Sink<A1, string, L1, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ) => Effect.Effect<
    A1,
    E1 | E2 | IE | OE,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >)
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L603)

Since v1.0.0

## demuxStdioRawToSeparateSinks

Demux multiple raw sockets, created from multiple container attach requests.
If no options are provided for a given stream, it will be ignored. This is
really just an Effect.all wrapper around `demuxRawSingleSink`.

To demux a single raw socket, you should use `demuxRawSingleSink`

**Signature**

```ts
declare const demuxStdioRawToSeparateSinks: (<A1, A2, L1, L2, E1, E2, E3, R1, R2, R3>(
  io: {
    stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>
    stdout: Sink.Sink<A1, string, L1, E2, R2>
    stderr: Sink.Sink<A2, string, L2, E3, R3>
  },
  options?: { encoding?: string | undefined } | undefined
) => <
  IE1 = never,
  IE2 = never,
  IE3 = never,
  OE1 = Socket.SocketError,
  OE2 = Socket.SocketError,
  OE3 = Socket.SocketError,
  R4 = never,
  R5 = never,
  R6 = never
>(
  sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R4, R5, R6>
) => Effect.Effect<
  CompressedDemuxOutput<A1, A2>,
  E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
  | Exclude<R1, Scope.Scope>
  | Exclude<R2, Scope.Scope>
  | Exclude<R3, Scope.Scope>
  | Exclude<R4, Scope.Scope>
  | Exclude<R5, Scope.Scope>
  | Exclude<R6, Scope.Scope>
>) &
  (<
    A1,
    A2,
    L1,
    L2,
    E1,
    E2,
    E3,
    R1,
    R2,
    R3,
    IE1 = never,
    IE2 = never,
    IE3 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    OE3 = Socket.SocketError,
    R4 = never,
    R5 = never,
    R6 = never
  >(
    sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R4, R5, R6>,
    io: {
      stdin: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>
      stdout: Sink.Sink<A1, string, L1, E2, R2>
      stderr: Sink.Sink<A2, string, L2, E3, R3>
    },
    options?: { encoding?: string | undefined } | undefined
  ) => Effect.Effect<
    CompressedDemuxOutput<A1, A2>,
    E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
    | Exclude<R1, Scope.Scope>
    | Exclude<R2, Scope.Scope>
    | Exclude<R3, Scope.Scope>
    | Exclude<R4, Scope.Scope>
    | Exclude<R5, Scope.Scope>
    | Exclude<R6, Scope.Scope>
  >)
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L639)

Since v1.0.0

## demuxStdioRawToSingleSink

Demux multiple raw sockets, created from multiple container attach requests.
If no options are provided for a given stream, it will be ignored. This is
really just an Effect.all wrapper around `demuxRawSingleSink`.

To demux a single raw socket, you should use `demuxRawSingleSink`

**Signature**

```ts
declare const demuxStdioRawToSingleSink: (<A1, L1, E1, E2, R1, R2>(
  source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
  sink: Sink.Sink<A1, string, L1, E2, R2>,
  options?: { encoding?: string | undefined } | undefined
) => <
  IE1 = never,
  IE2 = never,
  IE3 = never,
  OE1 = Socket.SocketError,
  OE2 = Socket.SocketError,
  OE3 = Socket.SocketError,
  R3 = never,
  R4 = never,
  R5 = never
>(
  sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R3, R4, R5>
) => Effect.Effect<
  A1,
  E1 | E2 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
  | Exclude<R1, Scope.Scope>
  | Exclude<R2, Scope.Scope>
  | Exclude<R3, Scope.Scope>
  | Exclude<R4, Scope.Scope>
  | Exclude<R5, Scope.Scope>
>) &
  (<
    A1,
    L1,
    E1,
    E2,
    R1,
    R2,
    IE1 = never,
    IE2 = never,
    IE3 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    OE3 = Socket.SocketError,
    R3 = never,
    R4 = never,
    R5 = never
  >(
    sockets: HeterogeneousStdioRawInput<IE1 | E1, IE2, IE3, OE1, OE2, OE3, R3, R4, R5>,
    source: Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
    sink: Sink.Sink<A1, string, L1, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ) => Effect.Effect<
    A1,
    E1 | E2 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
    | Exclude<R1, Scope.Scope>
    | Exclude<R2, Scope.Scope>
    | Exclude<R3, Scope.Scope>
    | Exclude<R4, Scope.Scope>
    | Exclude<R5, Scope.Scope>
  >)
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L627)

Since v1.0.0

## demuxStdioRawTupled

Demux multiple raw sockets, created from multiple container attach requests.
If no options are provided for a given stream, it will be ignored. This is
really just an Effect.all wrapper around `demuxRawSingleSink`.

To demux a single raw socket, you should use `demuxRawSingleSink`

**Signature**

```ts
declare const demuxStdioRawTupled: <
  A1 = void,
  A2 = void,
  L1 = never,
  L2 = never,
  E1 = never,
  E2 = never,
  E3 = never,
  R1 = never,
  R2 = never,
  R3 = never,
  IE1 = never,
  IE2 = never,
  IE3 = never,
  OE1 = Socket.SocketError,
  OE2 = Socket.SocketError,
  OE3 = Socket.SocketError,
  R4 = never,
  R5 = never,
  R6 = never
>(
  sockets: HeterogeneousStdioTupledRawInput<
    A1,
    A2,
    L1,
    L2,
    E1,
    E2,
    E3,
    R1,
    R2,
    R3,
    IE1,
    IE2,
    IE3,
    OE1,
    OE2,
    OE3,
    R4,
    R5,
    R6
  >,
  options?: { encoding?: string | undefined } | undefined
) => Effect.Effect<
  CompressedDemuxOutput<A1, A2>,
  E1 | E2 | E3 | IE1 | IE2 | IE3 | OE1 | OE2 | OE3,
  | Exclude<R1, Scope.Scope>
  | Exclude<R2, Scope.Scope>
  | Exclude<R3, Scope.Scope>
  | Exclude<R4, Scope.Scope>
  | Exclude<R5, Scope.Scope>
  | Exclude<R6, Scope.Scope>
>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L615)

Since v1.0.0

## demuxToSingleSink

Demux either a raw socket or a multiplexed socket to a single sink.

**Signature**

```ts
declare const demuxToSingleSink: {
  <A1, L1, E1, E2, R1, R2>(
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, L1, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): <IE = never, OE = Socket.SocketError, R3 = never>(
    sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>
  ) => Effect.Effect<
    A1,
    E1 | E2 | IE | OE | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
    sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>,
    source: Stream.Stream<string | Uint8Array, E1, R1>,
    sink: Sink.Sink<A1, string, L1, E2, R2>,
    options?: { encoding?: string | undefined } | undefined
  ): Effect.Effect<
    A1,
    E1 | E2 | IE | OE | ParseResult.ParseError,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L669)

Since v1.0.0

# DemuxStdio

## demuxFromStdinToStdoutAndStderr

Demux either a raw stream socket or a multiplexed stream socket from stdin to
stdout and stderr. If given a raw stream socket, then stdout and stderr will
be combined on the same sink. If given a multiplexed stream socket, then
stdout and stderr will be forwarded to different sinks. If given multiple raw
stream sockets, then you can provide different individual sockets for stdin,
stdout, and stderr.

If you are looking for a way to demux to the console instead of stdin,
stdout, and stderr then see `demuxSocketWithInputToConsole`. Since we
are interacting with stdin, stdout, and stderr this function dynamically
imports the `@effect/platform-node` package.

**Signature**

```ts
declare const demuxFromStdinToStdoutAndStderr: <IE = never, OE = Socket.SocketError, R = never>(
  sockets: EitherMultiplexedInput<IE, OE, R>,
  options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => Effect.Effect<void, IE | OE | PlatformError.PlatformError | ParseResult.ParseError, Exclude<R, Scope.Scope>>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L843)

Since v1.0.0

## demuxWithInputToConsole

Demux either a raw stream socket or a multiplexed stream socket to the
console. If given a raw stream socket, then stdout and stderr will be
combined on the same sink. If given a multiplexed stream socket, then stdout
and stderr will be forwarded to different sinks. If given multiple raw stream
sockets, then you can provide different individual sockets for stdin, stdout,
and stderr.

If you are looking for a way to demux to stdin, stdout, and stderr instead of
the console then see `demuxSocketFromStdinToStdoutAndStderr`.

**Signature**

```ts
declare const demuxWithInputToConsole: <E, R1, IE = never, OE = Socket.SocketError, R2 = never>(
  sockets: EitherMultiplexedInput<E | IE, OE, R2>,
  input: Stream.Stream<string | Uint8Array, E, R1>,
  options?: { bufferSize?: number | undefined; encoding?: string | undefined } | undefined
) => Effect.Effect<void, E | IE | OE | ParseResult.ParseError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L815)

Since v1.0.0

# Fanning

## fan

**Signature**

```ts
declare const fan: {
  <IE = never, OE = Socket.SocketError, R = never>(options: {
    readonly requestedCapacity:
      | number
      | { readonly stdinCapacity: number; readonly stdoutCapacity: number; readonly stderrCapacity: number }
    readonly encoding?: string | undefined
  }): (
    multiplexedInput: EitherMultiplexedInput<IE, OE, R>
  ) => Effect.Effect<
    {
      stdin: RawChannel<IE, IE | OE | ParseResult.ParseError, never>
      stdout: RawChannel<IE, IE | OE | ParseResult.ParseError, never>
      stderr: RawChannel<IE, IE | OE | ParseResult.ParseError, never>
    },
    never,
    Exclude<R, Scope.Scope>
  >
  <IE = never, OE = Socket.SocketError, R = never>(
    multiplexedInput: EitherMultiplexedInput<IE, OE, R>,
    options: {
      readonly requestedCapacity:
        | number
        | { readonly stdinCapacity: number; readonly stdoutCapacity: number; readonly stderrCapacity: number }
      readonly encoding?: string | undefined
    }
  ): Effect.Effect<
    {
      stdin: RawChannel<IE, IE | OE | ParseResult.ParseError, never>
      stdout: RawChannel<IE, IE | OE | ParseResult.ParseError, never>
      stderr: RawChannel<IE, IE | OE | ParseResult.ParseError, never>
    },
    never,
    Exclude<R, Scope.Scope>
  >
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L759)

Since v1.0.0

# Packing

## pack

**Signature**

```ts
declare const pack: {
  <
    IE1 = never,
    IE2 = never,
    IE3 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    OE3 = Socket.SocketError,
    R1 = never,
    R2 = never,
    R3 = never
  >(options: {
    readonly requestedCapacity:
      | number
      | { readonly stdinCapacity: number; readonly stdoutCapacity: number; readonly stderrCapacity: number }
    readonly encoding?: string | undefined
  }): (
    stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>
  ) => Effect.Effect<
    MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
    never,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
  <
    IE1 = never,
    IE2 = never,
    IE3 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    OE3 = Socket.SocketError,
    R1 = never,
    R2 = never,
    R3 = never
  >(
    stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
    options: {
      readonly requestedCapacity:
        | number
        | { readonly stdinCapacity: number; readonly stdoutCapacity: number; readonly stderrCapacity: number }
      readonly encoding?: string | undefined
    }
  ): Effect.Effect<
    MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
    never,
    Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
  >
}
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L699)

Since v1.0.0

# Predicates

## isMultiplexedChannel

**Signature**

```ts
declare const isMultiplexedChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
  u: unknown
) => u is MultiplexedChannel<IE, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L403)

Since v1.0.0

## isMultiplexedSocket

**Signature**

```ts
declare const isMultiplexedSocket: (u: unknown) => u is MultiplexedSocket
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L397)

Since v1.0.0

## isRawChannel

**Signature**

```ts
declare const isRawChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
  u: unknown
) => u is RawChannel<IE, IE | OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L389)

Since v1.0.0

## isRawSocket

**Signature**

```ts
declare const isRawSocket: (u: unknown) => u is RawSocket
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L383)

Since v1.0.0

## responseIsMultiplexedResponse

**Signature**

```ts
declare const responseIsMultiplexedResponse: (response: HttpClientResponse.HttpClientResponse) => boolean
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L418)

Since v1.0.0

## responseIsRawResponse

**Signature**

```ts
declare const responseIsRawResponse: (response: HttpClientResponse.HttpClientResponse) => boolean
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L411)

Since v1.0.0

## responseToStreamingSocketOrFailUnsafe

Transforms an http response into a multiplexed stream socket or a raw stream
socket. If the response is neither a multiplexed stream socket nor a raw or
can not be transformed, then an error will be returned.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
declare const responseToStreamingSocketOrFailUnsafe: (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<RawSocket | MultiplexedSocket, Socket.SocketError, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L447)

Since v1.0.0

# Transformations

## hijackResponseUnsafe

Hijacks an http response into a socket.

FIXME: this function relies on a hack to expose the underlying tcp socket
from the http client response. This will only work in NodeJs, not tested in
Bun/Deno yet, and will never work in the browser.

**Signature**

```ts
declare const hijackResponseUnsafe: (
  response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<Socket.Socket, Socket.SocketError, never>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L431)

Since v1.0.0

# Type ids

## MultiplexedChannelTypeId

**Signature**

```ts
declare const MultiplexedChannelTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L80)

Since v1.0.0

## MultiplexedChannelTypeId (type alias)

**Signature**

```ts
type MultiplexedChannelTypeId = typeof MultiplexedChannelTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L86)

Since v1.0.0

## MultiplexedSocketTypeId

**Signature**

```ts
declare const MultiplexedSocketTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L68)

Since v1.0.0

## MultiplexedSocketTypeId (type alias)

**Signature**

```ts
type MultiplexedSocketTypeId = typeof MultiplexedSocketTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L74)

Since v1.0.0

## RawChannelTypeId

**Signature**

```ts
declare const RawChannelTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L56)

Since v1.0.0

## RawChannelTypeId (type alias)

**Signature**

```ts
type RawChannelTypeId = typeof RawChannelTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L62)

Since v1.0.0

## RawSocketTypeId

**Signature**

```ts
declare const RawSocketTypeId: unique symbol
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L44)

Since v1.0.0

## RawSocketTypeId (type alias)

**Signature**

```ts
type RawSocketTypeId = typeof RawSocketTypeId
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L50)

Since v1.0.0

# Types

## AnyMultiplexedInput (type alias)

**Signature**

```ts
type AnyMultiplexedInput = EitherMultiplexedInput<any, any, any>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L204)

Since v1.0.0

## AnyRawInput (type alias)

**Signature**

```ts
type AnyRawInput = EitherRawInput<any, any, any>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L192)

Since v1.0.0

## CompressedDemuxOutput (type alias)

**Signature**

```ts
type CompressedDemuxOutput<A1, A2> = A1 extends undefined | void
  ? A2 extends undefined | void
    ? void
    : readonly [stdout: undefined, stderr: A2]
  : A2 extends undefined | void
    ? readonly [stdout: A1, stderr: undefined]
    : readonly [stdout: A1, stderr: A2]
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L326)

Since v1.0.0

## EitherMultiplexedInput (type alias)

**Signature**

```ts
type EitherMultiplexedInput<IE, OE, R> = MultiplexedSocket | MultiplexedChannel<IE, OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L198)

Since v1.0.0

## EitherRawInput (type alias)

**Signature**

```ts
type EitherRawInput<IE, OE, R> = RawSocket | RawChannel<IE, OE, R>
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L185)

Since v1.0.0

## HeterogeneousStdioRawInput (type alias)

**Signature**

```ts
type HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3> =
  | { stdin: EitherRawInput<IE1, OE1, R1>; stdout?: never; stderr?: never }
  | { stdin?: never; stdout: EitherRawInput<IE2, OE2, R2>; stderr?: never }
  | { stdin?: never; stdout?: never; stderr: EitherRawInput<IE3, OE3, R3> }
  | { stdin: EitherRawInput<IE1, OE1, R1>; stdout: EitherRawInput<IE2, OE2, R2>; stderr?: never }
  | { stdin: EitherRawInput<IE1, OE1, R1>; stdout?: never; stderr: EitherRawInput<IE3, OE3, R3> }
  | { stdin?: never; stdout: EitherRawInput<IE2, OE2, R2>; stderr: EitherRawInput<IE3, OE3, R3> }
  | {
      stdin: EitherRawInput<IE1, OE1, R1>
      stdout: EitherRawInput<IE2, OE2, R2>
      stderr: EitherRawInput<IE3, OE3, R3>
    }
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L236)

Since v1.0.0

## HeterogeneousStdioTupledRawInput (type alias)

**Signature**

```ts
type HeterogeneousStdioTupledRawInput<
  A1,
  A2,
  L1,
  L2,
  E1,
  E2,
  E3,
  R1,
  R2,
  R3,
  IE1,
  IE2,
  IE3,
  OE1,
  OE2,
  OE3,
  R4,
  R5,
  R6
> =
  | {
      stdin: readonly [
        Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        EitherRawInput<E1 | IE1, OE1, R4>
      ]
      stdout?: never
      stderr?: never
    }
  | {
      stdin?: never
      stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>]
      stderr?: never
    }
  | {
      stdin?: never
      stdout?: never
      stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>]
    }
  | {
      stdin: readonly [
        Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        EitherRawInput<E1 | IE1, OE1, R4>
      ]
      stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>]
      stderr?: never
    }
  | {
      stdin: readonly [
        Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        EitherRawInput<E1 | IE1, OE1, R4>
      ]
      stdout?: never
      stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>]
    }
  | {
      stdin?: never
      stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>]
      stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>]
    }
  | {
      stdin: readonly [
        Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
        EitherRawInput<E1 | IE1, OE1, R4>
      ]
      stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>]
      stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>]
    }
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L253)

Since v1.0.0

## HomogeneousStdioRawChannelInput (type alias)

**Signature**

```ts
type HomogeneousStdioRawChannelInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3> =
  | { stdin: RawChannel<IE1, OE1, R1>; stdout?: never; stderr?: never }
  | { stdin?: never; stdout: RawChannel<IE2, OE2, R2>; stderr?: never }
  | { stdin?: never; stdout?: never; stderr: RawChannel<IE3, OE3, R3> }
  | { stdin: RawChannel<IE1, OE1, R1>; stdout: RawChannel<IE2, OE2, R2>; stderr?: never }
  | { stdin: RawChannel<IE1, OE1, R1>; stdout?: never; stderr: RawChannel<IE3, OE3, R3> }
  | { stdin?: never; stdout: RawChannel<IE2, OE2, R2>; stderr: RawChannel<IE3, OE3, R3> }
  | { stdin: RawChannel<IE1, OE1, R1>; stdout: RawChannel<IE2, OE2, R2>; stderr: RawChannel<IE3, OE3, R3> }
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L223)

Since v1.0.0

## HomogeneousStdioRawSocketInput (type alias)

**Signature**

```ts
type HomogeneousStdioRawSocketInput =
  | { stdin: RawSocket; stdout?: never; stderr?: never }
  | { stdin?: never; stdout: RawSocket; stderr?: never }
  | { stdin?: never; stdout?: never; stderr: RawSocket }
  | { stdin: RawSocket; stdout: RawSocket; stderr?: never }
  | { stdin: RawSocket; stdout?: never; stderr: RawSocket }
  | { stdin?: never; stdout: RawSocket; stderr: RawSocket }
  | { stdin: RawSocket; stdout: RawSocket; stderr: RawSocket }
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L210)

Since v1.0.0

## MultiplexedContentType

**Signature**

```ts
declare const MultiplexedContentType: "application/vnd.docker.multiplexed-stream"
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L37)

Since v1.0.0

## RawContentType

**Signature**

```ts
declare const RawContentType: "application/vnd.docker.raw-stream"
```

[Source](https://github.com/leonitousconforti/the-moby-effect/tree/main/src/MobyDemux.ts#L31)

Since v1.0.0
