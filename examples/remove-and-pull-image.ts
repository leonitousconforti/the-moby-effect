import { Chunk, Console, Effect, Scope, Stream } from "effect";

import { IMobyService, MobyError, makeMobyClient } from "../src/main.js";

// Passing in no connection options means it will connect to the local docker socket
const localDocker: IMobyService = makeMobyClient();

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
const main: Effect.Effect<Scope.Scope, MobyError, void> = Effect.gen(function* (_: Effect.Adapter) {
    yield* _(localDocker.imageDelete({ name: "hello-world" }));

    const pullStream: Stream.Stream<never, MobyError, string> = yield* _(
        localDocker.imageCreate({ fromImage: "docker.io/library/hello-world:latest" })
    );

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    const data: string = yield* _(Stream.runCollect(pullStream).pipe(Effect.map(Chunk.join(""))));
    yield* _(Console.log(data));
});

await Effect.scoped(main).pipe(Effect.runPromise);
