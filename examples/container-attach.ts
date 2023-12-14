import * as NodeSocket from "@effect/experimental/Socket";
import * as NodeSink from "@effect/platform-node/Sink";
import * as NodeStream from "@effect/platform-node/Stream";
import { Channel, Chunk, Data, Effect, Sink, Stream } from "effect";

import * as MobyApi from "../src/main.js";
const localDocker: MobyApi.IMobyService = MobyApi.makeMobyClient();

/**
 * This is an attempt to implement the docker attach command using the docker
 * http api, checkout the docs here:
 * https://docs.docker.com/engine/api/v1.43/#tag/Container/operation/ContainerUnpause
 *
 * From the docs:
 *
 * "This endpoint hijacks the HTTP connection to transport stdin, stdout, and
 * stderr on the same socket. The TCP connection (from the initial http request)
 * is used for raw, bidirectional communication between the client and server.
 * The data exchanged over the hijacked connection is simply the raw data from
 * the process PTY and client's stdin."
 *
 * In this basic proof of concept, the container will be created with a tty and
 * stdin, stdout, and stderr will be attached to the container - so we just have
 * to treat the underlying tcp socket as a duplex stream somehow and
 * forward/receive from stdin and stdout respectively.
 *
 * To Treat
 */

await Effect.gen(function* (_: Effect.Adapter) {
    /**
     * Let's start by creating a container to play around with. This will pull
     * the official alpine docker image and wait for it to finish if is isn't
     * already downloaded locally. Next it will start a new container with the
     * official alpine image create a pseudo terminal and attach to it. We also
     * set the entrypoint of the container to /bin/sh so we will have a Bourne
     * shell when we attach. Finally, the run helper will wait until the freshly
     * created container is in the "running" state and, if it has a health
     * check, that it is healthy.
     */
    console.log("Spawning a container...");
    const { Id: containerId, Name: containerName } = yield* _(
        localDocker.run({
            imageOptions: { kind: "pull", fromImage: "docker.io/library/alpine:latest" },
            containerOptions: {
                body: {
                    Image: "docker.io/library/alpine:latest",
                    Entrypoint: ["/bin/sh"],
                    Tty: true,
                    OpenStdin: true,
                    AttachStdin: true,
                    AttachStdout: true,
                    AttachStderr: true,
                },
            },
        })
    );

    /**
     * Next we'll send a request to attach to the container. There will be no
     * response from the docker daemon in the body of this request. Instead, the
     * connection will be upgraded immediately (note: the connection is not
     * upgraded to a websocket, rather the tcp stream is just reused as a raw
     * stream for all 3 streams; stdin, stdout, and stderr). The tcp socket of
     * the request is present in the effect NodeHttp response object, and we can
     * access it from the response using a type assertion to make it appear
     * public.
     *
     * TODO: Once Socket from @effect/experimental is stable, let's check with
     * the effect maintainers about making this sneaky access public.
     */
    console.log(`Attempting to attach to container ${containerId}...`);
    const socket: NodeSocket.Socket = yield* _(
        localDocker.containerAttach({
            id: containerId,
            stdin: true,
            stdout: true,
            stderr: true,
            stream: true,
            detachKeys: "ctrl-e",
        })
    );

    /**
     * I was struggling to figure out how to use Channel and what its type
     * should be, I found declaring some errors helpful.
     */
    console.log(`Attached to container ${containerName}! (use "ctrl-e" then "enter" to disconnect)`);
    class StdinError extends Data.TaggedError("StdinError")<{ message: string }> {}
    class StdoutError extends Data.TaggedError("StdoutError")<{ message: string }> {}

    /**
     * Now we'll use the NodeSocket.toChannel helper to convert the NodeSocket
     * into a Channel. This will allow us to use the Channel helpers to pipe
     * data from stdin to the remote container and from the remote container to
     * stdout.
     *
     * TODO: Why does OurErr need to be a superset of InErr? Not sure if I am
     * understanding this type correctly, in particular the error parts.
     */
    const channel: Channel.Channel<
        never,
        StdinError,
        Chunk.Chunk<Uint8Array>,
        void,
        StdinError | StdoutError | NodeSocket.SocketError,
        Chunk.Chunk<Uint8Array>,
        void
    > = NodeSocket.toChannel(socket);

    /**
     * Now we'll create a stream from stdin and a sink from stdout. We'll use
     * the NodeStream.fromReadable helper to create a stream from stdin and the
     * NodeSink.fromWritable helper to create a sink from stdout.
     */
    const stdinStream: Stream.Stream<never, StdinError, Uint8Array> = NodeStream.fromReadable(
        () => process.stdin,
        () => new StdinError({ message: "stdin is not readable" })
    );
    const stdoutSink: Sink.Sink<never, StdoutError, string | Uint8Array, never, void> = NodeSink.fromWritable(
        () => process.stdout,
        () => new StdoutError({ message: "stdout is not writable" })
    );

    /**
     * I'm just going to connect sinks and streams and not pipe anything through
     * the channel because I had some type errors when I was trying to pipe the
     * channel straight to the stdout sink.
     */
    const channelStream: Stream.Stream<never, StdinError | StdoutError | NodeSocket.SocketError, Uint8Array> =
        Channel.toStream(
            channel as Channel.Channel<
                never,
                unknown,
                unknown,
                unknown,
                StdinError | StdoutError | NodeSocket.SocketError,
                Chunk.Chunk<Uint8Array>,
                void
            >
        );

    /**
     * I'm just going to connect sinks and streams and not pipe anything through
     * the channel because I had some type errors when I was trying to pipe the
     * channel straight to the stdout sink.
     */
    const channelSink: Sink.Sink<
        never,
        StdinError | StdoutError | NodeSocket.SocketError,
        Uint8Array,
        Uint8Array,
        void
    > = Channel.toSink(
        channel as Channel.Channel<
            never,
            StdinError,
            Chunk.Chunk<Uint8Array>,
            unknown,
            StdinError | StdoutError | NodeSocket.SocketError,
            Chunk.Chunk<Uint8Array>,
            void
        >
    );

    /**
     * Sending our stdin stream to the remote container is easy enough, just
     * pipe the stream through the channel.
     */
    const stdinToRemote = Stream.pipeThrough(stdinStream, channelSink);
    const remoteToStdout = Stream.pipeThrough(channelStream, stdoutSink);

    /**
     * This will wait until one of the streams is disconnected, which will
     * happen when either the container is killed/dies or the user initiates a
     * disconnect using the specified detach key. Once one of the streams is
     * disconnected, the other stream will be interrupted.
     *
     * FIXME: Why does console.log not work after this? Error
     * [ERR_STREAM_WRITE_AFTER_END]: write after end
     */
    yield* _(Effect.race(Stream.runDrain(remoteToStdout), Stream.runDrain(stdinToRemote)));

    // And finally we'll stop the container and delete it.
    console.log("Disconnected from container");
    console.log(`Removing container ${containerName}...`);
    yield* _(localDocker.containerDelete({ id: containerId, force: true }));
})
    .pipe(Effect.scoped)
    .pipe(Effect.runPromise);
