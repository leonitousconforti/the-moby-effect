// Run with: npx tsx examples/promises/container-with-volume.ts

import * as url from "node:url";

import { Effect, Function, Layer } from "effect";
import { DockerEngine, MobyConnection, MobySchemas, Promises } from "the-moby-effect";

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

// Pull the image, will be removed when the scope is closed
const pullStream = promiseClient.pull({ image: "ubuntu:latest" });
await promiseClient.followProgressInConsole(
    () => pullStream,
    (error) => error
);

const testDocument: string = url.fileURLToPath(new URL("container-with-volume.txt", import.meta.url));
const containerInspectResponse: MobySchemas.ContainerInspectResponse = await promiseClient.run({
    Image: "ubuntu:latest",
    Cmd: ["echo", "/app/test.txt"],
    HostConfig: {
        Binds: [`${testDocument}:/app/test.txt`],
    },
});

await promiseClient.stop(containerInspectResponse.Id);
