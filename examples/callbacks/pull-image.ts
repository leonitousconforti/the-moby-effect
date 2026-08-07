// Run with: pnpx tsx examples/callbacks/pull-image.ts
// Printing to the console is the point of these callback-API examples.
// @effect-diagnostics globalConsole:off

import { Callbacks, DockerEngine } from "the-moby-effect";

// Create a callbacks client from the local docker engine
const callbackClient = await Callbacks.callbackClient(DockerEngine.layerNodeJS);

// Pull the hello world image, will be removed when the scope is closed
const pullStream = callbackClient.pull({
    image: "docker.io/library/hello-world:latest",
});

callbackClient.followProgressInConsole(pullStream, (exit) => {
    console.log(exit);
});
