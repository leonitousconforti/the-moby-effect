// Run with: pnpx tsx examples/effect/container-with-volume.ts

import { Effect, Function, Layer, Path } from "effect";

import type { MobySchemas } from "the-moby-effect";

import { NodeRuntime, NodeServices } from "@effect/platform-node";
import { DockerEngine, MobyConnection, MobyConvey, MobyEndpoints } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrap
);

// Recommended reading: https://blog.logrocket.com/docker-volumes-vs-bind-mounts/
const program = Effect.gen(function* () {
    const path: Path.Path = yield* Path.Path;
    const containers = yield* MobyEndpoints.Containers;

    // Pull the image, will be removed when the scope is closed
    const pullStream = yield* DockerEngine.pullScoped({ image: "ubuntu:latest" });
    yield* MobyConvey.followProgressInConsole(pullStream);

    const testDocument: string = yield* path.fromFileUrl(new URL("container-with-volume.txt", import.meta.url));
    const containerInspectResponse: MobySchemas.ContainerInspectResponse = yield* DockerEngine.runScoped({
        Image: "ubuntu:latest",
        Cmd: ["echo", "/app/test.txt"],
        HostConfig: {
            Binds: [`${testDocument}:/app/test.txt`],
        },
    });

    yield* containers.wait(containerInspectResponse.Id);
    yield* containers.delete(containerInspectResponse.Id);
});

program.pipe(Effect.scoped, Effect.provide([localDocker, NodeServices.layer]), NodeRuntime.runMain);
