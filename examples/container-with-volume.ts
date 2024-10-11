// Run with: tsx examples/container-with-volume.ts

import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";

import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Containers from "the-moby-effect/endpoints/Containers";
import * as Platforms from "the-moby-effect/Platforms";
import * as Schemas from "the-moby-effect/Schemas";

// Connect to the local docker engine at "/var/run/docker.sock"
const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    Platforms.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

// Recommended reading: https://blog.logrocket.com/docker-volumes-vs-bind-mounts/
const program = Effect.gen(function* () {
    const path: Path.Path = yield* Path.Path;
    const containers = yield* Containers.Containers;

    // Pull the image, will be removed when the scope is closed
    const pullStream = yield* DockerEngine.pullScoped({ image: "ubuntu:latest" });
    yield* Convey.followProgressInConsole(pullStream);

    const testDocument: string = yield* path.fromFileUrl(new URL("container-with-volume.txt", import.meta.url));
    const containerInspectResponse: Schemas.ContainerInspectResponse = yield* DockerEngine.runScoped({
        spec: {
            Image: "ubuntu:latest",
            Cmd: ["echo", "/app/test.txt"],
            HostConfig: {
                Binds: [`${testDocument}:/app/test.txt`],
            },
        },
    });

    yield* containers.wait({ id: containerInspectResponse.Id });
    yield* containers.delete({ id: containerInspectResponse.Id });
});

program
    .pipe(Effect.scoped)
    .pipe(Effect.provide(localDocker))
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
