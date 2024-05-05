import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Chunk from "effect/Chunk";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

import * as Images from "the-moby-effect/Images";
import * as MobyApi from "the-moby-effect/Moby";
import * as Schemas from "the-moby-effect/Schemas";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
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
    const images: Images.Images = yield* _(Images.Images);

    // Pull the image using the images service
    const pullStream: Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never> = yield* _(
        images.create({ fromImage: "docker.io/library/hello-world:latest" })
    );

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    const data = yield* _(Stream.runCollect(pullStream).pipe(Effect.map(Chunk.toReadonlyArray)));
    yield* _(Console.log(data));

    // Delete the image
    yield* _(images.delete({ name: "hello-world" }));
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
