/**
 * Demux utilities for different types of docker streams.
 *
 * @since 1.0.0
 */

import type * as PlatformError from "@effect/platform/Error";
import type * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import type * as Socket from "@effect/platform/Socket";
import type * as Channel from "effect/Channel";
import type * as Chunk from "effect/Chunk";
import type * as Effect from "effect/Effect";
import type * as ParseResult from "effect/ParseResult";
import type * as Pipeable from "effect/Pipeable";
import type * as Scope from "effect/Scope";
import type * as Sink from "effect/Sink";
import type * as Stream from "effect/Stream";

import * as internal from "./internal/demux/demux.ts";
import * as internalFan from "./internal/demux/fan.ts";
import * as internalHijack from "./internal/demux/hijack.ts";
import * as internalMultiplexed from "./internal/demux/multiplexed.ts";
import * as internalPack from "./internal/demux/pack.ts";
import * as internalRaw from "./internal/demux/raw.ts";
import * as internalStdio from "./internal/demux/stdio.ts";

/**
 * @since 1.0.0
 * @category Types
 */
export const RawContentType: "application/vnd.docker.raw-stream" = internalRaw.RawContentType;

/**
 * @since 1.0.0
 * @category Types
 */
export const MultiplexedContentType: "application/vnd.docker.multiplexed-stream" =
    internalMultiplexed.MultiplexedContentType;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const RawSocketTypeId: unique symbol = internalRaw.RawSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type RawSocketTypeId = typeof RawSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const RawChannelTypeId: unique symbol = internalRaw.RawChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type RawChannelTypeId = typeof RawChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedSocketTypeId: unique symbol = internalMultiplexed.MultiplexedSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedSocketTypeId = typeof MultiplexedSocketTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export const MultiplexedChannelTypeId: unique symbol = internalMultiplexed.MultiplexedChannelTypeId;

/**
 * @since 1.0.0
 * @category Type ids
 */
export type MultiplexedChannelTypeId = typeof MultiplexedChannelTypeId;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * Note for Leo: This exists because the input error type "IE" might not be
 * known at the time of converting the Socket to a Channel.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export interface RawSocket extends Pipeable.Pipeable {
    readonly "content-type": typeof RawContentType;
    readonly [RawSocketTypeId]: typeof RawSocketTypeId;
    readonly underlying: Socket.Socket;
}

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * Note for Leo: This exists because there is no way to convert from a Channel
 * to a Socket. In fact, with my current effect knowledge, I believe it is
 * impossible to implement. This is still needed though for the pack and fan
 * implementations which seek to return these types.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export interface RawChannel<in IE = unknown, out OE = Socket.SocketError, out R = never> extends Pipeable.Pipeable {
    readonly "content-type": typeof RawContentType;
    readonly [RawChannelTypeId]: typeof RawChannelTypeId;
    readonly underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        OE,
        IE,
        void,
        unknown,
        R
    >;
}

/**
 * When the TTY setting is disabled in POST /containers/create, the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out stdout
 * and stderr. The stream consists of a series of frames, each containing a
 * header and a payload.
 *
 * Note for Leo: This exists because the input error type "IE" might not be
 * known at the time of converting the Socket to a Channel.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export interface MultiplexedSocket extends Pipeable.Pipeable {
    readonly "content-type": typeof MultiplexedContentType;
    readonly [MultiplexedSocketTypeId]: MultiplexedSocketTypeId;
    readonly underlying: Socket.Socket;
}

/**
 * When the TTY setting is disabled in POST /containers/create, the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out stdout
 * and stderr. The stream consists of a series of frames, each containing a
 * header and a payload.
 *
 * Note for Leo: This exists because there is no way to convert from a Channel
 * to a Socket. In fact, with my current effect knowledge, I believe it is
 * impossible to implement. This is still needed though for the pack and fan
 * implementations which seek to return these types.
 *
 * @since 1.0.0
 * @category Branded Types
 */
export interface MultiplexedChannel<in IE = unknown, out OE = Socket.SocketError, out R = never>
    extends Pipeable.Pipeable {
    readonly "content-type": typeof MultiplexedContentType;
    readonly [MultiplexedChannelTypeId]: MultiplexedChannelTypeId;
    readonly underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        OE,
        IE,
        void,
        unknown,
        R
    >;
}

/**
 * @since 1.0.0
 * @category Types
 */
export type EitherRawInput<IE, OE, R> = RawSocket | RawChannel<IE, OE, R>;

/**
 * @since 1.0.0
 * @category Types
 */

export type AnyRawInput = EitherRawInput<any, any, any>;

/**
 * @since 1.0.0
 * @category Types
 */
export type EitherMultiplexedInput<IE, OE, R> = MultiplexedSocket | MultiplexedChannel<IE, OE, R>;

/**
 * @since 1.0.0
 * @category Types
 */
export type AnyMultiplexedInput = EitherMultiplexedInput<any, any, any>;

/**
 * @since 1.0.0
 * @category Types
 */
export type HomogeneousStdioRawSocketInput =
    | { stdin: RawSocket; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: RawSocket; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: RawSocket }
    | { stdin: RawSocket; stdout: RawSocket; stderr?: never }
    | { stdin: RawSocket; stdout?: never; stderr: RawSocket }
    | { stdin?: never; stdout: RawSocket; stderr: RawSocket }
    | { stdin: RawSocket; stdout: RawSocket; stderr: RawSocket };

/**
 * @since 1.0.0
 * @category Types
 */
export type HomogeneousStdioRawChannelInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3> =
    | { stdin: RawChannel<IE1, OE1, R1>; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: RawChannel<IE2, OE2, R2>; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: RawChannel<IE3, OE3, R3> }
    | { stdin: RawChannel<IE1, OE1, R1>; stdout: RawChannel<IE2, OE2, R2>; stderr?: never }
    | { stdin: RawChannel<IE1, OE1, R1>; stdout?: never; stderr: RawChannel<IE3, OE3, R3> }
    | { stdin?: never; stdout: RawChannel<IE2, OE2, R2>; stderr: RawChannel<IE3, OE3, R3> }
    | { stdin: RawChannel<IE1, OE1, R1>; stdout: RawChannel<IE2, OE2, R2>; stderr: RawChannel<IE3, OE3, R3> };

/**
 * @since 1.0.0
 * @category Types
 */
export type HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3> =
    | { stdin: EitherRawInput<IE1, OE1, R1>; stdout?: never; stderr?: never }
    | { stdin?: never; stdout: EitherRawInput<IE2, OE2, R2>; stderr?: never }
    | { stdin?: never; stdout?: never; stderr: EitherRawInput<IE3, OE3, R3> }
    | { stdin: EitherRawInput<IE1, OE1, R1>; stdout: EitherRawInput<IE2, OE2, R2>; stderr?: never }
    | { stdin: EitherRawInput<IE1, OE1, R1>; stdout?: never; stderr: EitherRawInput<IE3, OE3, R3> }
    | { stdin?: never; stdout: EitherRawInput<IE2, OE2, R2>; stderr: EitherRawInput<IE3, OE3, R3> }
    | {
          stdin: EitherRawInput<IE1, OE1, R1>;
          stdout: EitherRawInput<IE2, OE2, R2>;
          stderr: EitherRawInput<IE3, OE3, R3>;
      };

/**
 * @since 1.0.0
 * @category Types
 */
export type HeterogeneousStdioTupledRawInput<
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
    R6,
> =
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout?: never;
          stderr?: never;
      }
    | {
          stdin?: never;
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr?: never;
      }
    | {
          stdin?: never;
          stdout?: never;
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      }
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr?: never;
      }
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout?: never;
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      }
    | {
          stdin?: never;
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      }
    | {
          stdin: readonly [
              Stream.Stream<string | Uint8Array | Socket.CloseEvent, E1, R1>,
              EitherRawInput<E1 | IE1, OE1, R4>,
          ];
          stdout: readonly [EitherRawInput<IE2, OE2, R5>, Sink.Sink<A1, string, L1, E2, R2>];
          stderr: readonly [EitherRawInput<IE3, OE3, R6>, Sink.Sink<A2, string, L2, E3, R3>];
      };

/**
 * @since 1.0.0
 * @category Types
 */
export type CompressedDemuxOutput<A1, A2> = A1 extends undefined | void
    ? A2 extends undefined | void
        ? void
        : readonly [stdout: undefined, stderr: A2]
    : A2 extends undefined | void
      ? readonly [stdout: A1, stderr: undefined]
      : readonly [stdout: A1, stderr: A2];

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeRawSocket: (underlying: Socket.Socket) => RawSocket = internalRaw.makeRawSocket;

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeRawChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        OE,
        IE,
        void,
        unknown,
        R
    >
) => RawChannel<IE, IE | OE, R> = internalRaw.makeRawChannel;

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeMultiplexedSocket: (underlying: Socket.Socket) => MultiplexedSocket =
    internalMultiplexed.makeMultiplexedSocket;

/**
 * @since 1.0.0
 * @category Constructors
 */
export const makeMultiplexedChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
    underlying: Channel.Channel<
        Chunk.Chunk<Uint8Array>,
        Chunk.Chunk<string | Uint8Array | Socket.CloseEvent>,
        OE,
        IE,
        void,
        unknown,
        R
    >
) => MultiplexedChannel<IE, IE | OE, R> = internalMultiplexed.makeMultiplexedChannel;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawSocket: (u: unknown) => u is RawSocket = internalRaw.isRawSocket;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
) => u is RawChannel<IE, IE | OE, R> = internalRaw.isRawChannel;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedSocket: (u: unknown) => u is MultiplexedSocket = internalMultiplexed.isMultiplexedSocket;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isMultiplexedChannel: <IE = unknown, OE = Socket.SocketError, R = never>(
    u: unknown
) => u is MultiplexedChannel<IE, IE | OE, R> = internalMultiplexed.isMultiplexedChannel;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsRawResponse: (response: HttpClientResponse.HttpClientResponse) => boolean =
    internalRaw.responseIsRawResponse;

/**
 * @since 1.0.0
 * @category Predicates
 */
export const responseIsMultiplexedResponse: (response: HttpClientResponse.HttpClientResponse) => boolean =
    internalMultiplexed.responseIsMultiplexedResponse;

/**
 * Hijacks an http response into a socket.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Transformations
 */
export const hijackResponseUnsafe: (
    response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<Socket.Socket, Socket.SocketError, never> = internalHijack.hijackResponseUnsafe;

/**
 * Transforms an http response into a multiplexed stream socket or a raw stream
 * socket. If the response is neither a multiplexed stream socket nor a raw or
 * can not be transformed, then an error will be returned.
 *
 * FIXME: this function relies on a hack to expose the underlying tcp socket
 * from the http client response. This will only work in NodeJs, not tested in
 * Bun/Deno yet, and will never work in the browser.
 *
 * @since 1.0.0
 * @category Predicates
 */
export const responseToStreamingSocketOrFailUnsafe: (
    response: HttpClientResponse.HttpClientResponse
) => Effect.Effect<RawSocket | MultiplexedSocket, Socket.SocketError, never> =
    internalHijack.responseToStreamingSocketOrFailUnsafe;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const asRawChannel: <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherRawInput<IE, OE, R>
) => RawChannel<IE, OE, R> = internalRaw.asRawChannel;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const asMultiplexedChannel: <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherMultiplexedInput<IE, OE, R>
) => MultiplexedChannel<IE, OE, R> = internalMultiplexed.asMultiplexedChannel;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawToStream: <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherRawInput<IE, OE, R>
) => Stream.Stream<Uint8Array, IE | OE, R> = internalRaw.rawToStream;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedToStream: <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherMultiplexedInput<IE, OE, R>
) => Stream.Stream<Uint8Array, IE | OE, R> = internalMultiplexed.multiplexedToStream;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawToSink: <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherRawInput<IE, OE, R>
) => Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> = internalRaw.rawToSink;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedToSink: <IE = never, OE = Socket.SocketError, R = never>(
    input: EitherMultiplexedInput<IE, OE, R>
) => Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, IE | OE, R> =
    internalMultiplexed.multiplexedToSink;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawFromStreamWith: <IE>() => <E, R>(
    input: Stream.Stream<Uint8Array, IE | E, R>
) => RawChannel<IE, IE | E, R> = internalRaw.rawFromStreamWith;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedFromStreamWith: <IE>() => <E, R>(
    input: Stream.Stream<Uint8Array, IE | E, R>
) => MultiplexedChannel<IE, IE | E, R> = internalMultiplexed.multiplexedFromStreamWith;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawFromStream: <E, R>(input: Stream.Stream<Uint8Array, E, R>) => RawChannel<never, E, R> =
    internalRaw.rawFromStream;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedFromStream: <E, R>(input: Stream.Stream<Uint8Array, E, R>) => MultiplexedChannel<never, E, R> =
    internalMultiplexed.multiplexedFromStream;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const rawFromSink: <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
) => RawChannel<never, E, R> = internalRaw.rawFromSink;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const multiplexedFromSink: <E, R>(
    input: Sink.Sink<void, string | Uint8Array | Socket.CloseEvent, Uint8Array, E, R>
) => MultiplexedChannel<never, E, R> = internalMultiplexed.multiplexedFromSink;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const interleaveRaw: <
    IE1 = never,
    IE2 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: EitherRawInput<IE1, OE1, R1>,
    stderr: EitherRawInput<IE2, OE2, R2>
) => Stream.Stream<Uint8Array, IE1 | IE2 | OE1 | OE2, R1 | R2> = internalRaw.interleaveRaw;

/**
 * @since 1.0.0
 * @category Conversions
 */
export const mergeRawToTaggedStream: <
    IE1 = never,
    IE2 = never,
    OE1 = Socket.SocketError,
    OE2 = Socket.SocketError,
    R1 = never,
    R2 = never,
>(
    stdout: EitherRawInput<IE1, OE1, R1>,
    stderr: EitherRawInput<IE2, OE2, R2>,
    options?:
        | {
              bufferSize?: number | undefined;
          }
        | undefined
) => Stream.Stream<
    | {
          _tag: "stdout";
          value: Uint8Array;
      }
    | {
          _tag: "stderr";
          value: Uint8Array;
      },
    IE1 | IE2 | OE1 | OE2,
    R1 | R2
> = internalRaw.mergeRawToTaggedStream;

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxRawToSingleSink = internalRaw.demuxRawToSingleSink;

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSingleSink}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSingleSink}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxStdioRawTupled = internalRaw.demuxStdioRawTupled;

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSingleSink}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSingleSink}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxStdioRawToSingleSink = internalRaw.demuxStdioRawToSingleSink;

/**
 * Demux multiple raw sockets, created from multiple container attach requests.
 * If no options are provided for a given stream, it will be ignored. This is
 * really just an Effect.all wrapper around {@link demuxRawSingleSink}.
 *
 * To demux a single raw socket, you should use {@link demuxRawSingleSink}
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxStdioRawToSeparateSinks = internalRaw.demuxStdioRawToSeparateSinks;

/**
 * Demux a multiplexed socket, all output goes to a single sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxMultiplexedToSingleSink = internalMultiplexed.demuxMultiplexedToSingleSink;

/**
 * Demux a multiplexed socket. When given a multiplexed socket, we must parse
 * the chunks by headers and then forward each chunk based on its datatype to
 * the correct sink.
 *
 * When partitioning the stream into stdout and stderr, the first sink may
 * advance by up to bufferSize elements further than the slower one. The default
 * bufferSize is 16.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxMultiplexedToSeparateSinks = internalMultiplexed.demuxMultiplexedToSeparateSinks;

/**
 * Demux either a raw socket or a multiplexed socket to a single sink.
 *
 * @since 1.0.0
 * @category Demux
 */
export const demuxToSingleSink: {
    // Data-last signature.
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
    >;
    // Data-first signature.
    <A1, L1, E1, E2, R1, R2, IE = never, OE = Socket.SocketError, R3 = never>(
        sockets: EitherRawInput<E1 | IE, OE, R3> | EitherMultiplexedInput<E1 | IE, OE, R3>,
        source: Stream.Stream<string | Uint8Array, E1, R1>,
        sink: Sink.Sink<A1, string, L1, E2, R2>,
        options?: { encoding?: string | undefined } | undefined
    ): Effect.Effect<
        A1,
        E1 | E2 | IE | OE | ParseResult.ParseError,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = internal.demuxToSingleSink;

/**
 * @since 1.0.0
 * @category Packing
 */
export const pack: {
    <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R1 = never,
        R2 = never,
        R3 = never,
    >(options: {
        readonly requestedCapacity:
            | number
            | {
                  readonly stdinCapacity: number;
                  readonly stdoutCapacity: number;
                  readonly stderrCapacity: number;
              };
        readonly encoding?: string | undefined;
    }): (
        stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>
    ) => Effect.Effect<
        MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
        never,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
    <
        IE1 = never,
        IE2 = never,
        IE3 = never,
        OE1 = Socket.SocketError,
        OE2 = Socket.SocketError,
        OE3 = Socket.SocketError,
        R1 = never,
        R2 = never,
        R3 = never,
    >(
        stdio: HeterogeneousStdioRawInput<IE1, IE2, IE3, OE1, OE2, OE3, R1, R2, R3>,
        options: {
            readonly requestedCapacity:
                | number
                | {
                      readonly stdinCapacity: number;
                      readonly stdoutCapacity: number;
                      readonly stderrCapacity: number;
                  };
            readonly encoding?: string | undefined;
        }
    ): Effect.Effect<
        MultiplexedChannel<IE1 | IE2 | IE3, IE1 | IE2 | IE3 | OE1 | OE2 | OE3, never>,
        never,
        Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope> | Exclude<R3, Scope.Scope>
    >;
} = internalPack.pack;

/**
 * @since 1.0.0
 * @category Fanning
 */
export const fan: {
    <IE = never, OE = Socket.SocketError, R = never>(options: {
        readonly requestedCapacity:
            | number
            | {
                  readonly stdinCapacity: number;
                  readonly stdoutCapacity: number;
                  readonly stderrCapacity: number;
              };
        readonly encoding?: string | undefined;
    }): (multiplexedInput: EitherMultiplexedInput<IE, OE, R>) => Effect.Effect<
        {
            stdin: RawChannel<IE, IE | OE | ParseResult.ParseError, never>;
            stdout: RawChannel<IE, IE | OE | ParseResult.ParseError, never>;
            stderr: RawChannel<IE, IE | OE | ParseResult.ParseError, never>;
        },
        never,
        Exclude<R, Scope.Scope>
    >;
    <IE = never, OE = Socket.SocketError, R = never>(
        multiplexedInput: EitherMultiplexedInput<IE, OE, R>,
        options: {
            readonly requestedCapacity:
                | number
                | {
                      readonly stdinCapacity: number;
                      readonly stdoutCapacity: number;
                      readonly stderrCapacity: number;
                  };
            readonly encoding?: string | undefined;
        }
    ): Effect.Effect<
        {
            stdin: RawChannel<IE, IE | OE | ParseResult.ParseError, never>;
            stdout: RawChannel<IE, IE | OE | ParseResult.ParseError, never>;
            stderr: RawChannel<IE, IE | OE | ParseResult.ParseError, never>;
        },
        never,
        Exclude<R, Scope.Scope>
    >;
} = internalFan.fan;

/**
 * Demux either a raw stream socket or a multiplexed stream socket to the
 * console. If given a raw stream socket, then stdout and stderr will be
 * combined on the same sink. If given a multiplexed stream socket, then stdout
 * and stderr will be forwarded to different sinks. If given multiple raw stream
 * sockets, then you can provide different individual sockets for stdin, stdout,
 * and stderr.
 *
 * If you are looking for a way to demux to stdin, stdout, and stderr instead of
 * the console then see {@link demuxSocketFromStdinToStdoutAndStderr}.
 *
 * @since 1.0.0
 * @category DemuxStdio
 */
export const demuxWithInputToConsole: <E, R1, IE = never, OE = Socket.SocketError, R2 = never>(
    sockets: EitherMultiplexedInput<E | IE, OE, R2>,
    input: Stream.Stream<string | Uint8Array, E, R1>,
    options?:
        | {
              bufferSize?: number | undefined;
              encoding?: string | undefined;
          }
        | undefined
) => Effect.Effect<void, E | IE | OE | ParseResult.ParseError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =
    internalStdio.demuxWithInputToConsole;

/**
 * Demux either a raw stream socket or a multiplexed stream socket from stdin to
 * stdout and stderr. If given a raw stream socket, then stdout and stderr will
 * be combined on the same sink. If given a multiplexed stream socket, then
 * stdout and stderr will be forwarded to different sinks. If given multiple raw
 * stream sockets, then you can provide different individual sockets for stdin,
 * stdout, and stderr.
 *
 * If you are looking for a way to demux to the console instead of stdin,
 * stdout, and stderr then see {@link demuxSocketWithInputToConsole}. Since we
 * are interacting with stdin, stdout, and stderr this function dynamically
 * imports the `@effect/platform-node` package.
 *
 * @since 1.0.0
 * @category DemuxStdio
 */
export const demuxFromStdinToStdoutAndStderr: <IE = never, OE = Socket.SocketError, R = never>(
    sockets: EitherMultiplexedInput<IE, OE, R>,
    options?:
        | {
              bufferSize?: number | undefined;
              encoding?: string | undefined;
          }
        | undefined
) => Effect.Effect<void, IE | OE | PlatformError.PlatformError | ParseResult.ParseError, Exclude<R, Scope.Scope>> =
    internalStdio.demuxFromStdinToStdoutAndStderr;
