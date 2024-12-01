/* eslint-disable no-console */

// Run with: npx tsx examples/callbacks/container-with-volume.ts

import * as url from "node:url";

import { Effect, Exit, Function, Layer } from "effect";
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

// Pull the image, will be removed when the scope is closed
const pullStream = callbackClient.pull({ image: "ubuntu:latest" });
callbackClient.followProgressInConsole(
    () => pullStream,
    (error) => error,
    (exit) => {
        console.log(exit);

        const testDocument: string = url.fileURLToPath(new URL("container-with-volume.txt", import.meta.url));
        callbackClient.run(
            {
                spec: {
                    Image: "ubuntu:latest",
                    Cmd: ["echo", "/app/test.txt"],
                    HostConfig: {
                        Binds: [`${testDocument}:/app/test.txt`],
                    },
                },
            },
            (exit) => {
                if (Exit.isFailure(exit)) {
                    console.error(exit);
                    return;
                }

                const containerInspectResponse = exit.value;
                console.log(containerInspectResponse);
                callbackClient.stop(containerInspectResponse.Id, (exit) => {
                    console.log(exit);
                });
            }
        );
    }
);
