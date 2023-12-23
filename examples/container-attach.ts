import * as NodeSocket from "@effect/experimental/Socket";
import * as NodeRuntime from "@effect/platform-node/Runtime";
import * as NodeSink from "@effect/platform-node/Sink";
import * as NodeStream from "@effect/platform-node/Stream";
import { Data, Effect, Layer, Stream, pipe } from "effect";

import * as MobyApi from "../src/index.js";

const localContainers: Layer.Layer<never, never, MobyApi.Containers.Containers> =
    MobyApi.Containers.fromConnectionOptions({
        connection: "unix",
        socketPath: "/var/run/docker.sock",
    });

const localImages: Layer.Layer<never, never, MobyApi.Images.Images> = MobyApi.Images.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

const program = Effect.gen(function* (_: Effect.Adapter) {
    const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

    const { Id: containerId, Name: containerName } = yield* _(
        MobyApi.run({
            imageOptions: { kind: "pull", fromImage: "docker.io/library/alpine:latest" },
            containerOptions: {
                spec: {
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

    const socket: NodeSocket.Socket = yield* _(
        containers.attach({
            id: containerId!,
            stdin: true,
            stdout: true,
            stderr: true,
            stream: true,
            detachKeys: "ctrl-e",
        })
    );

    class StdinError extends Data.TaggedError("StdinError")<{ message: string }> {}
    class StdoutError extends Data.TaggedError("StdoutError")<{ message: string }> {}

    yield* _(
        pipe(
            NodeStream.fromReadable(
                () => process.stdin,
                () => new StdinError({ message: "stdin is not readable" })
            ),
            Stream.pipeThroughChannel(NodeSocket.toChannel(socket)),
            Stream.run(
                NodeSink.fromWritable(
                    () => process.stdout,
                    () => new StdoutError({ message: "stdout is not writable" }),
                    { endOnDone: false }
                )
            )
        )
    );

    console.log("Disconnected from container");
    console.log(`Removing container ${containerName}...`);
    yield* _(containers.delete({ id: containerId!, force: true }));
});

program.pipe(Effect.provide(localImages)).pipe(Effect.provide(localContainers)).pipe(NodeRuntime.runMain);
