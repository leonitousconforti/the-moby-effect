/* eslint-disable @typescript-eslint/typedef */
import * as Socket from "@effect/experimental/Socket";
import * as NodeSink from "@effect/platform-node/Sink";
import * as NodeStream from "@effect/platform-node/Stream";
import { Data, Effect, Stream } from "effect";

import * as MobyApi from "../src/main.js";
import { runMain } from "@effect/platform-node/Runtime";
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

const program = Effect.gen(function* (_) {
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
    const socket = yield* _(
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

    yield* _(
        NodeStream.fromReadable(
            () => process.stdin,
            () => new StdinError({ message: "stdin is not readable" })
        ).pipe(
            Stream.pipeThroughChannel(Socket.toChannel(socket)),
            Stream.run(
                NodeSink.fromWritable(
                    () => process.stdout,
                    () => new StdoutError({ message: "stdout is not writable" }),
                    { endOnDone: false }
                )
            )
        )
    );

    // And finally we'll stop the container and delete it.
    console.log("Disconnected from container");
    console.log(`Removing container ${containerName}...`);
    yield* _(localDocker.containerDelete({ id: containerId, force: true }));
});

runMain(Effect.scoped(program));
