/* eslint-disable no-console */

// Run with: npx tsx examples/callbacks/pull-image.ts

import { Effect, Function, Layer } from "effect";
import { Callbacks, DockerEngine, MobyConnection } from "the-moby-effect";

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

// Create a callbacks client from the local docker engine
const callbackClient = await Callbacks.callbackClient(localDocker);

// Pull the hello world image, will be removed when the scope is closed
const pullStream = callbackClient.pull({
    image: "docker.io/library/hello-world:latest",
});

callbackClient.followProgressInConsole(
    () => pullStream,
    (error) => error,
    (exit) => {
        console.log(exit);
    }
);
