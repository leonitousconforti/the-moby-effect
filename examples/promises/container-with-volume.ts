// Run with: pnpx tsx examples/promises/container-with-volume.ts

import * as url from "node:url";

import { DockerEngine, Promises } from "the-moby-effect";

// Create a promise client from the local docker engine
const promiseClient = await Promises.promiseClient(DockerEngine.layerNodeJS);

// Pull the image
const pullStream = promiseClient.pull({ image: "ubuntu:latest" });
await promiseClient.followProgressInConsole(pullStream);

const testDocument = url.fileURLToPath(new URL("container-with-volume.txt", import.meta.url));
const containerInspectResponse = await promiseClient.run({
    Image: "ubuntu:latest",
    Cmd: ["echo", "/app/test.txt"],
    HostConfig: {
        Binds: [`${testDocument}:/app/test.txt`],
    },
});

await promiseClient.stop(containerInspectResponse.Id);
