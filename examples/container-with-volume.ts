import * as path from "node:url";

import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Effect from "effect/Effect";

import * as DockerCommon from "the-moby-effect/Docker";
import * as MobyApi from "the-moby-effect/Moby";
import * as Schemas from "the-moby-effect/Schemas";
import * as Containers from "the-moby-effect/endpoints/Containers";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
    socketPath: "/var/run/docker.sock",
});

const testDocument: string = path.fileURLToPath(new URL("container-with-volume.txt", import.meta.url));

// Recommended reading: https://blog.logrocket.com/docker-volumes-vs-bind-mounts/
const program = Effect.gen(function* () {
    const containers: Containers.ContainersImpl = yield* Containers.Containers;

    const containerInspectResponse: Schemas.ContainerInspectResponse = yield* DockerCommon.run({
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
    });

    yield* containers.wait({ id: containerInspectResponse.Id! });
    yield* containers.delete({ id: containerInspectResponse.Id! });
    return;
});

program.pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
