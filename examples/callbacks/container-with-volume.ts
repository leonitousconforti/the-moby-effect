// Run with: pnpx tsx examples/callbacks/container-with-volume.ts

import { Exit } from "effect";

import * as url from "node:url";

import { Callbacks, DockerEngine } from "the-moby-effect";

// Create a callbacks client from the local docker engine
const callbackClient = await Callbacks.callbackClient(DockerEngine.layerNodeJS);

// Pull the image, will be removed when the scope is closed
const pullStream = callbackClient.pull({ image: "ubuntu:latest" });
callbackClient.followProgressInConsole(pullStream, (exit) => {
    console.log(exit);

    const testDocument: string = url.fileURLToPath(new URL("container-with-volume.txt", import.meta.url));
    callbackClient.run(
        {
            Image: "ubuntu:latest",
            Cmd: ["echo", "/app/test.txt"],
            HostConfig: {
                Binds: [`${testDocument}:/app/test.txt`],
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
});
