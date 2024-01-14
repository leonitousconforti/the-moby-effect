import * as NodeSocket from "@effect/experimental/Socket";
import * as NodeRuntime from "@effect/platform-node/Runtime";
import * as NodeSink from "@effect/platform-node/Sink";
import * as NodeStream from "@effect/platform-node/Stream";
import * as Console from "effect/Console";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Stream from "effect/Stream";

import * as MobyApi from "../src/index.js";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
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
        Function.pipe(
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

    yield* _(Console.log("Disconnected from container"));
    yield* _(Console.log(`Removing container ${containerName}...`));
    yield* _(containers.delete({ id: containerId!, force: true }));
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
