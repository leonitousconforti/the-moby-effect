import * as NodeRuntime from "@effect/platform-node/Runtime";
import { Chunk, Console, Effect, Stream } from "effect";

import * as MobyApi from "../src/index.js";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

const dockerHubLogin = {
    username: "username",
    password: "password",
    serveraddress: "https://registry-1.docker.io/v2",
};

// SystemAuthResponse { Status: 'Login Succeeded', IdentityToken: '' }
// Login succeeded but no identity token was given, you must pass the bse64 encoded auth options directly using the X-Registry-Auth header
// {"status":"Pulling from confo014/hello-world","id":"latest"}
// {"status":"Pulling fs layer","progressDetail":{},"id":"c1ec31eb5944"}
// {"status":"Downloading","progressDetail":{"current":720,"total":2459},"progress":"[==============\u003e                                    ]     720B/2.459kB","id":"c1ec31eb5944"}
// {"status":"Downloading","progressDetail":{"current":2459,"total":2459},"progress":"[==================================================\u003e]  2.459kB/2.459kB","id":"c1ec31eb5944"}
// {"status":"Verifying Checksum","progressDetail":{},"id":"c1ec31eb5944"}
// {"status":"Download complete","progressDetail":{},"id":"c1ec31eb5944"}
// {"status":"Extracting","progressDetail":{"current":2459,"total":2459},"progress":"[==================================================\u003e]  2.459kB/2.459kB","id":"c1ec31eb5944"}
// {"status":"Extracting","progressDetail":{"current":2459,"total":2459},"progress":"[==================================================\u003e]  2.459kB/2.459kB","id":"c1ec31eb5944"}
// {"status":"Pull complete","progressDetail":{},"id":"c1ec31eb5944"}
// {"status":"Digest: sha256:d37ada95d47ad12224c205a938129df7a3e52345828b4fa27b03a98825d1e2e7"}
// {"status":"Status: Downloaded newer image for confo014/hello-world:latest"}
const program = Effect.gen(function* (_: Effect.Adapter) {
    const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);
    const system: MobyApi.System.Systems = yield* _(MobyApi.System.Systems);

    // Get an identity token from docker hub
    const authResponse: MobyApi.Schemas.SystemAuthResponse = yield* _(system.auth(dockerHubLogin));
    yield* _(Console.log(authResponse));

    if (authResponse.Status === "Login Succeeded" && !authResponse.IdentityToken) {
        yield* _(
            Console.warn(
                "Login succeeded but no identity token was given, you must pass the bse64 encoded auth options directly using the X-Registry-Auth header"
            )
        );
    }

    // Pull the image using the images service
    const pullStream: Stream.Stream<never, MobyApi.Images.ImagesError, string> = yield* _(
        images.create({
            fromImage: `docker.io/${dockerHubLogin.username}/hello-world:latest`,
            "X-Registry-Auth":
                authResponse.IdentityToken || Buffer.from(JSON.stringify(dockerHubLogin)).toString("base64"),
        })
    );

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    const data: string = yield* _(Stream.runCollect(pullStream).pipe(Effect.map(Chunk.join(""))));
    yield* _(Console.log(data));
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
