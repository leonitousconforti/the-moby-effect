import * as NodeRuntime from "@effect/platform-node/Runtime";
import { Chunk, Console, Effect, Stream } from "effect";

import * as MobyApi from "../src/index.js";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

// {"status":"Pulling from library/hello-world","id":"latest"}
// {"status":"Pulling fs layer","progressDetail":{},"id":"719385e32844"}
// {"status":"Downloading","progressDetail":{"current":719,"total":2457},"progress":"[==============\u003e                                    ]     719B/2.457kB","id":"719385e32844"}
// {"status":"Downloading","progressDetail":{"current":2457,"total":2457},"progress":"[==================================================\u003e]  2.457kB/2.457kB","id":"719385e32844"}
// {"status":"Verifying Checksum","progressDetail":{},"id":"719385e32844"}
// {"status":"Download complete","progressDetail":{},"id":"719385e32844"}
// {"status":"Extracting","progressDetail":{"current":2457,"total":2457},"progress":"[==================================================\u003e]  2.457kB/2.457kB","id":"719385e32844"}
// {"status":"Extracting","progressDetail":{"current":2457,"total":2457},"progress":"[==================================================\u003e]  2.457kB/2.457kB","id":"719385e32844"}
// {"status":"Pull complete","progressDetail":{},"id":"719385e32844"}
// {"status":"Digest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0"}
// {"status":"Status: Downloaded newer image for hello-world:latest"}
const program = Effect.gen(function* (_: Effect.Adapter) {
    const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);

    // Pull the image using the images service
    const pullStream: Stream.Stream<never, MobyApi.Images.ImagesError, MobyApi.Schemas.BuildInfo> = yield* _(
        images.create({ fromImage: "docker.io/library/hello-world:latest" })
    );

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    const data = yield* _(Stream.runCollect(pullStream).pipe(Effect.map(Chunk.toReadonlyArray)));
    yield* _(Console.log(data));

    // Delete the image
    yield* _(images.delete({ name: "hello-world" }));
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
