// Run with: tsx examples/effect/authentication.ts

import { NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer, Redacted } from "effect";
import { DockerEngine, MobyConnection, MobyConvey } from "the-moby-effect";

// Put your docker hub credentials here
const registryAuth = DockerEngine.RegistryAuth.Credentials({
    username: Redacted.make("username"),
    password: Redacted.make("password"),
    serverAddress: "https://index.docker.io/v1/",
});

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect,
    Layer.provide(registryAuth)
);

// Pulling from confo014/hello-world
// Pulling fs layer
// Downloading [==============>                                    ]     719B/2.459kB
// Downloading [==================================================>]  2.459kB/2.459kB
// Download complete
// Extracting [==================================================>]  2.459kB/2.459kB
// Extracting [==================================================>]  2.459kB/2.459kB
// Pull complete
// Digest: sha256:d37ada95d47ad12224c205a938129df7a3e52345828b4fa27b03a98825d1e2e7
// Status: Downloaded newer image for confo014/hello-world:latest
const program = Effect.gen(function* () {
    const pullStream = yield* DockerEngine.pullScoped({
        image: `docker.io/username/hello-world:latest`,
    });
    yield* MobyConvey.followProgressInConsole(pullStream);
});

program.pipe(Effect.scoped).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
