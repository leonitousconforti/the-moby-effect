import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Chunk, Effect, Stream } from "effect";

import { IMobyService, makeMobyLayer } from "../src/main.js";

const localConnectionOptions = {
    protocol: "unix",
    socketPath: "/var/run/docker.sock",
} as const;

const [MyLocalMobyClient, MobyServiceLocal] = makeMobyLayer("localMobyClient", localConnectionOptions);
console.log(`Connected to local docker daemon @ ${localConnectionOptions.socketPath}`);

const pullResults = await Effect.gen(function* (_: Effect.Adapter) {
    const localDocker: IMobyService = yield* _(MyLocalMobyClient);

    const buildStream: Stream.Stream<never, NodeHttp.error.ResponseError, string> = yield* _(
        localDocker.imageCreate({ fromImage: "docker.io/library/hello-world:latest" })
    );
    return yield* _(Stream.runCollect(buildStream).pipe(Effect.map(Chunk.join(""))));
})
    .pipe(Effect.scoped)
    .pipe(Effect.provide(MobyServiceLocal))
    .pipe(Effect.runPromise);

// Connected to local docker daemon @ /var/run/docker.sock
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
console.log(pullResults);
