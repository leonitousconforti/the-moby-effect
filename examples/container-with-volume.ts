import path from "node:url";

import * as NodeRuntime from "@effect/platform-node/Runtime";
import * as Effect from "effect/Effect";

import * as MobyApi from "../src/index.js";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
    socketPath: "/var/run/docker.sock",
});

const testDocument: string = path.fileURLToPath(new URL("container-with-volume.txt", import.meta.url));

// Recommended reading: https://blog.logrocket.com/docker-volumes-vs-bind-mounts/
const program = Effect.gen(function* (_: Effect.Adapter) {
    const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);

    const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
        MobyApi.DockerCommon.run({
            imageOptions: { kind: "pull", fromImage: "ubuntu:latest" },
            containerOptions: {
                spec: {
                    Tty: true,
                    AttachStdin: true,
                    AttachStdout: true,
                    AttachStderr: true,
                    Image: "ubuntu:latest",
                    Cmd: ["echo", "/app/test.txt"],
                    HostConfig: { Binds: [`${testDocument}:/app/test.txt`] },
                },
            },
        })
    );

    yield* _(containers.wait({ id: containerInspectResponse.Id! }));
    yield* _(containers.delete({ id: containerInspectResponse.Id! }));
    return;
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
