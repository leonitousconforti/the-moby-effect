/**
 * Demux utilities for raw streams.
 *
 * @since 1.0.0
 */

import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Brand from "effect/Brand";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

/**
 * @since 1.0.0
 * @category Types
 * @internal
 */
export const RawStreamSocketContentType = "application/vnd.docker.raw-stream" as const;

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 *
 * @since 1.0.0
 * @category Types
 */
export type RawStreamSocket = Socket.Socket & {
    "content-type": typeof RawStreamSocketContentType;
} & Brand.Brand<"RawStreamSocket">;

/**
 * @since 1.0.0
 * @category Brands
 */
export const RawStreamSocket = Brand.refined<RawStreamSocket>(
    (socket) => socket["content-type"] === RawStreamSocketContentType,
    (socket) =>
        Brand.error(
            `Expected a raw stream socket with content type "${RawStreamSocketContentType}", but this socket has content type ${socket["content-type"]}`
        )
);

/**
 * @since 1.0.0
 * @category Predicates
 */
export const isRawStreamSocketResponse = (response: HttpClientResponse.HttpClientResponse) =>
    response.headers["content-type"] === RawStreamSocketContentType;

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * {@link demuxSocket}
 *
 * @since 1.0.0
 * @category Demux
 * @see https://docs.docker.com/engine/api/v1.46/#tag/Container/operation/ContainerAttach
 */
export const demuxRawSocket = Function.dual<
    <A1, E1, E2>(
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink: Sink.Sink<A1, string, never, E2, never>
    ) => (socket: RawStreamSocket) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, never>,
    <A1, E1, E2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink: Sink.Sink<A1, string, never, E2, never>
    ) => Effect.Effect<A1, E1 | E2 | Socket.SocketError, never>
>(
    3,
    <A1, E1, E2>(
        socket: RawStreamSocket,
        source: Stream.Stream<string | Uint8Array, E1, never>,
        sink: Sink.Sink<A1, string, never, E2, never>
    ): Effect.Effect<A1, E1 | E2 | Socket.SocketError, never> =>
        Function.pipe(
            source,
            Stream.pipeThroughChannelOrFail(Socket.toChannel(socket)),
            Stream.decodeText("utf-8"),
            Stream.run(sink)
        )
);
