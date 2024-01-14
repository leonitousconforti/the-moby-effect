import * as NodeSocket from "@effect/experimental/Socket";
import * as NodeRuntime from "@effect/platform-node/Runtime";
import * as Effect from "effect/Effect";

import * as MobyApi from "../src/index.js";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

const program = Effect.gen(function* (_: Effect.Adapter) {
    const execs: MobyApi.Execs.Execs = yield* _(MobyApi.Execs.Execs);
    const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

    const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
        MobyApi.run({
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: {
                spec: { Image: "ubuntu:latest", Cmd: ["sleep", "infinity"] },
            },
        })
    );

    const execCreateResponse: Readonly<MobyApi.Schemas.IdResponse> = yield* _(
        execs.container({
            id: containerInspectResponse.Id!,
            execConfig: {
                Cmd: ["echo", "hello world"],
                AttachStdout: true,
                AttachStderr: true,
            },
        })
    );

    const socket: NodeSocket.Socket = yield* _(
        execs.start({ id: execCreateResponse.Id!, execStartConfig: { Detach: false } })
    );

    yield* _(MobyApi.demuxToStdinAndStdout(socket));
    yield* _(containers.kill({ id: containerInspectResponse.Id! }));
    yield* _(containers.delete({ id: containerInspectResponse.Id! }));
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
