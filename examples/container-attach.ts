import * as NodeRuntime from "@effect/platform-node/Runtime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as MobyApi from "../src/index.js";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

const program = Effect.gen(function* (_: Effect.Adapter) {
    const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

    const { Id: containerId } = yield* _(
        MobyApi.DockerCommon.runScoped({
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

    const socket = yield* _(
        containers.attach({
            id: containerId!,
            stdin: true,
            stdout: true,
            stderr: true,
            stream: true,
            detachKeys: "ctrl-e",
        })
    );

    yield* _(MobyApi.DemuxHelpers.demuxSocketFromStdinToStdoutAndStderr(socket));
    yield* _(Console.log("Disconnected from container"));
});

program.pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
