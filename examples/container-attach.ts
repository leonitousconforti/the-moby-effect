import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

import * as DemuxHelpers from "the-moby-effect/Demux";
import * as DockerCommon from "the-moby-effect/Docker";
import * as MobyApi from "the-moby-effect/Moby";
import * as Containers from "the-moby-effect/moby/Containers";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
    socketPath: "/var/run/docker.sock",
});

const program = Effect.gen(function* () {
    const containers: Containers.ContainersImpl = yield* Containers.Containers;

    const { Id: containerId } = yield* DockerCommon.runScoped({
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
    });

    const socket = yield* containers.attach({
        id: containerId!,
        stdin: true,
        stdout: true,
        stderr: true,
        stream: true,
        detachKeys: "ctrl-e",
    });

    yield* DemuxHelpers.demuxSocketFromStdinToStdoutAndStderr(socket);
    yield* Console.log("Disconnected from container");
});

program.pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
