import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Chunk from "effect/Chunk";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

// import * as Images from "the-moby-effect/Images";
import * as MobyApi from "the-moby-effect/Moby";
import * as Schemas from "the-moby-effect/Schemas";
// import * as System from "the-moby-effect/System";

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
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
const program = Effect.gen(function* () {
    const images: MobyApi.Images.ImagesImpl = yield* MobyApi.Images.Images;
    const system: MobyApi.System.SystemsImpl = yield* MobyApi.System.Systems;

    // Get an identity token from docker hub
    const authResponse: Schemas.SystemAuthResponse = yield* system.auth(dockerHubLogin);
    yield* Console.log(authResponse);

    if (authResponse.Status === "Login Succeeded" && !authResponse.IdentityToken) {
        yield* Console.warn(
            "Login succeeded but no identity token was given, you must pass the bse64 encoded auth options directly using the X-Registry-Auth header"
        );
    }

    // Pull the image using the images service
    const pullStream: Stream.Stream<Schemas.BuildInfo, MobyApi.Images.ImagesError, never> = images.create({
        fromImage: `docker.io/${dockerHubLogin.username}/hello-world:latest`,
        "X-Registry-Auth": authResponse.IdentityToken || Buffer.from(JSON.stringify(dockerHubLogin)).toString("base64"),
    });

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    return yield* Stream.runCollect(pullStream).pipe(Effect.map(Chunk.toReadonlyArray));
});

program.pipe(Console.log).pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
