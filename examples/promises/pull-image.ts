// Run with: pnpx tsx examples/promises/pull-image.ts

import { Effect, Function, Layer } from "effect";
import { DockerEngine, MobyConnection, Promises } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
);

// Create a promise client from the local docker engine
const promiseClient = await Promises.promiseClient(localDocker);

// Pull the hello world image, will be removed when the scope is closed
const pullStream = promiseClient.pull({
    image: "docker.io/library/hello-world:latest",
});

await promiseClient.followProgressInConsole(
    () => pullStream,
    (error) => error
);
