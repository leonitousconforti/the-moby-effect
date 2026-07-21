// Run with: pnpx tsx examples/promises/pull-image.ts

import { DockerEngine, Promises } from "the-moby-effect";

// Create a promise client from the local docker engine
const promiseClient = await Promises.promiseClient(DockerEngine.layerNodeJS);

// Pull the hello world image
const pullStream = promiseClient.pull({ image: "docker.io/library/hello-world:latest" });
await promiseClient.followProgressInConsole(pullStream);
