import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Effect from "effect/Effect";

import * as MobyApi from "the-moby-effect/Moby";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
    socketPath: "/var/run/docker.sock",
});

const program = Effect.gen(function* (_: Effect.Adapter) {
    const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
        MobyApi.DockerCommon.runScoped({
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: {
                spec: { Image: "ubuntu:latest", Cmd: ["sleep", "infinity"] },
            },
        })
    );

    const socket = yield* _(
        MobyApi.DockerCommon.exec(
            {
                id: containerInspectResponse.Id!,
                execConfig: {
                    Cmd: ["echo", "hello world"],
                    AttachStdout: true,
                    AttachStderr: true,
                },
            },
            { Detach: false }
        )
    );

    yield* _(MobyApi.DemuxHelpers.demuxSocketFromStdinToStdoutAndStderr(socket));
});

program.pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
