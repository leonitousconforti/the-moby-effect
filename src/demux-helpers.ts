import * as NodeSocket from "@effect/experimental/Socket/Node";
import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as NodeSink from "@effect/platform-node/Sink";
import * as NodeStream from "@effect/platform-node/Stream";
import * as Brand from "effect/Brand";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import { IExposeSocketOnEffectClientResponse } from "./request-helpers.js";

// Errors when multiplexing stdin and stdout
export class StdinError extends Data.TaggedError("StdinError")<{ message: string }> {}
export class StdoutError extends Data.TaggedError("StdoutError")<{ message: string }> {}
export class StderrError extends Data.TaggedError("StderrError")<{ message: string }> {}

/**
 * When the TTY setting is enabled in POST /containers/create, the stream is not
 * multiplexed. The data exchanged over the hijacked connection is simply the
 * raw data from the process PTY and client's stdin.
 */
export type RawStreamSocket = NodeSocket.Socket & {
    "content-type": "application/vnd.docker.raw-stream";
} & Brand.Brand<"RawStreamSocket">;

export const RawStreamSocket = Brand.refined<RawStreamSocket>(
    (socket) => socket["content-type"] === "application/vnd.docker.raw-stream",
    () => Brand.error(`Expected a raw stream socket`)
);

export const isRawStreamSocketResponse = (response: NodeHttp.response.ClientResponse) =>
    response.headers["content-type"] === "application/vnd.docker.raw-stream";

/**
 * When the TTY setting is disabled in POST /containers/create, the HTTP
 * Content-Type header is set to application/vnd.docker.multiplexed-stream and
 * the stream over the hijacked connected is multiplexed to separate out stdout
 * and stderr. The stream consists of a series of frames, each containing a
 * header and a payload.
 */
export type MultiplexedStreamSocket = NodeSocket.Socket & {
    "content-type": "application/vnd.docker.multiplexed-stream";
} & Brand.Brand<"MultiplexedStreamSocket">;

export const MultiplexedStreamSocket = Brand.refined<MultiplexedStreamSocket>(
    (socket) => socket["content-type"] === "application/vnd.docker.multiplexed-stream",
    () => Brand.error(`Expected a multiplexed stream socket`)
);

export const isMultiplexedStreamSocketResponse = (response: NodeHttp.response.ClientResponse) =>
    response.headers["content-type"] === "application/vnd.docker.multiplexed-stream";

/**
 * Transforms an http response into a multiplexed stream socket or a raw stream
 * socket. If the response is neither a multiplexed stream socket nor a raw,
 * then an error will be returned.
 */
export const responseToStreamingSocketOrFail = (
    response: NodeHttp.response.ClientResponse
): Effect.Effect<never, NodeSocket.SocketError, RawStreamSocket | MultiplexedStreamSocket> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const socket = (response as IExposeSocketOnEffectClientResponse).source.socket;
        const effectSocket: NodeSocket.Socket = yield* _(NodeSocket.fromNetSocket(Effect.sync(() => socket)));

        if (isRawStreamSocketResponse(response)) {
            return RawStreamSocket({ ...effectSocket, "content-type": "application/vnd.docker.raw-stream" });
        } else if (isMultiplexedStreamSocketResponse(response)) {
            return MultiplexedStreamSocket({
                ...effectSocket,
                "content-type": "application/vnd.docker.multiplexed-stream",
            });
        } else {
            return yield* _(
                new NodeSocket.SocketError({ reason: "Open", error: "Response is not a streaming socket" })
            );
        }
    });

// Multiplexed stream socket header types
export enum MultiplexedStreamSocketHeaderType {
    Stdin = 0,
    Stdout = 1,
    Stderr = 2,
}

/**
 * Demux a raw socket. When given a raw socket of the remote process's pty,
 * there is no way to differentiate between stdout and stderr so they are
 * combined on the same sink.
 *
 * {@link demuxSocket}
 *
 * @see https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerAttach
 */
export const demuxRawSocket = Function.dual<
    <E1, E2>(
        source: Stream.Stream<never, E1, Uint8Array>,
        sink: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ) => (socket: RawStreamSocket) => Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void>,
    <E1, E2>(
        socket: RawStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ) => Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void>
>(
    3,
    <E1, E2>(
        socket: RawStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ): Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void> =>
        Function.pipe(source, Stream.pipeThroughChannel(NodeSocket.toChannel(socket)), Stream.run(sink))
);

/**
 * Demux a multiplexed socket. When given a multiplexed socket, we must parse
 * the chunks by headers and then forward each chunk based on its datatype to
 * the correct sink.
 *
 * {@link demuxSocket}
 *
 * @see https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerAttach
 */
export const demuxMultiplexedSocket = Function.dual<
    <E1, E2, E3>(
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>,
        sink2: Sink.Sink<never, E3, string | Uint8Array, never, void>
    ) => (socket: MultiplexedStreamSocket) => Effect.Effect<never, E1 | E2 | E3 | NodeSocket.SocketError, void>,
    <E1, E2, E3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>,
        sink2: Sink.Sink<never, E3, string | Uint8Array, never, void>
    ) => Effect.Effect<never, E1 | E2 | E3 | NodeSocket.SocketError, void>
>(
    4,
    <E1, E2, E3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>,
        sink2: Sink.Sink<never, E3, string | Uint8Array, never, void>
    ): Effect.Effect<never, E1 | E2 | E3 | NodeSocket.SocketError, void> =>
        Function.pipe(
            source,
            Stream.pipeThroughChannel(NodeSocket.toChannel(socket)),
            Stream.mapConcat((data) => {
                let offset = 0;
                const output: Array<{ type: MultiplexedStreamSocketHeaderType; contents: Uint8Array }> = [];

                while (offset <= data.length - 8) {
                    const header = new DataView(data.buffer);
                    const type = header.getUint8(0);
                    const length = header.getUint32(4);
                    const thisMessage = data.slice(8, 8 + length);
                    output.push({ type, contents: thisMessage });
                    offset += 8 + length;
                }

                return output;
            }),
            Stream.filter(
                ({ type }) =>
                    type === MultiplexedStreamSocketHeaderType.Stdout ||
                    type === MultiplexedStreamSocketHeaderType.Stderr
            ),
            Stream.partition(({ type }) => type === MultiplexedStreamSocketHeaderType.Stderr),
            Effect.map(([stdout, stderr]) => [
                stdout.pipe(
                    Stream.map(({ contents }) => contents),
                    Stream.run(sink1)
                ),
                stderr.pipe(
                    Stream.map(({ contents }) => contents),
                    Stream.run(sink2)
                ),
            ]),
            Effect.map(Effect.all),
            Effect.flatten,
            Effect.scoped
        )
);

/**
 * Demux an http socket. The source stream is the stream that you want to
 * forward to the containers stdin. If the socket is a raw stream, then there
 * will only be one sink that combines the containers stdout and stderr. if the
 * socket is a multiplexed stream, then there will be two sinks, one for stdout
 * and one for stderr.
 */
export const demuxSocket: {
    <E1, E2>(
        socket: RawStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ): Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void>;
    <E1, E2>(
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>
    ): (socket: RawStreamSocket) => Effect.Effect<never, E1 | E2 | NodeSocket.SocketError, void>;
    <E1, E2, E3>(
        socket: MultiplexedStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>,
        sink2: Sink.Sink<never, E3, string | Uint8Array, never, void>
    ): Effect.Effect<never, E1 | E2 | E3 | NodeSocket.SocketError, void>;
    <E1, E2, E3>(
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>,
        sink2: Sink.Sink<never, E3, string | Uint8Array, never, void>
    ): (socket: MultiplexedStreamSocket) => Effect.Effect<never, E1 | E2 | E3 | NodeSocket.SocketError, void>;
} = Function.dual(
    (arguments_) => arguments_[0][NodeSocket.SocketTypeId],
    <E1, E2, E3>(
        socket: RawStreamSocket | MultiplexedStreamSocket,
        source: Stream.Stream<never, E1, Uint8Array>,
        sink1: Sink.Sink<never, E2, string | Uint8Array, never, void>,
        sink2?: Sink.Sink<never, E3, string | Uint8Array, never, void>
    ): Effect.Effect<never, E1 | E2 | E3 | NodeSocket.SocketError, void> => {
        switch (socket["content-type"]) {
            case "application/vnd.docker.raw-stream": {
                return demuxRawSocket(socket, source, sink1);
            }
            case "application/vnd.docker.multiplexed-stream": {
                return demuxMultiplexedSocket(socket, source, sink1, sink2!);
            }
        }
    }
);

/**
 * Demux either a raw stream socket or a multiplexed stream socket from stdin to
 * stdout and stderr. If given a raw stream socket, then stdout and stderr will
 * be combined on the same sink. If given a multiplexed stream socket, then
 * stdout and stderr will be forwarded to different sinks.
 */
export const demuxSocketFromStdinToStdoutAndStderr = (
    socket: RawStreamSocket | MultiplexedStreamSocket
): Effect.Effect<never, NodeSocket.SocketError | StdinError | StdoutError | StderrError, void> => {
    const stdin = NodeStream.fromReadable(
        () => process.stdin,
        () => new StdinError({ message: "stdin is not readable" })
    );
    const stdout = NodeSink.fromWritable(
        () => process.stdout,
        () => new StdoutError({ message: "stdout is not writable" }),
        { endOnDone: false }
    );
    const stderr = NodeSink.fromWritable(
        () => process.stderr,
        () => new StderrError({ message: "stderr is not writable" }),
        { endOnDone: false }
    );

    switch (socket["content-type"]) {
        case "application/vnd.docker.raw-stream": {
            return demuxRawSocket(socket, stdin, stdout);
        }
        case "application/vnd.docker.multiplexed-stream": {
            return demuxMultiplexedSocket(socket, stdin, stdout, stderr);
        }
    }
};
