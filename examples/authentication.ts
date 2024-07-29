// Run with: tsx examples/authentication.ts

import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Images from "the-moby-effect/endpoints/Images";
import * as System from "the-moby-effect/endpoints/System";
import * as PlatformAgents from "the-moby-effect/PlatformAgents";
import * as Schemas from "the-moby-effect/Schemas";

// Connect to the local docker engine at "/var/run/docker.sock"
const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    PlatformAgents.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
);

// Put your docker hub credentials here
const dockerHubLogin = {
    username: "username",
    password: "password",
    serveraddress: "https://index.docker.io/v1/",
};

// RegistryAuthenticateOKBody { Status: 'Login Succeeded' }
// Login succeeded but no identity token was given, you must pass the base64 encoded auth options directly using the X-Registry-Auth header
// Pulling from confo014/hello-world
// Pulling fs layer
// Downloading [==============>                                    ]     719B/2.459kB
// Downloading [==================================================>]  2.459kB/2.459kB
// Download complete
// Extracting [==================================================>]  2.459kB/2.459kB
// Extracting [==================================================>]  2.459kB/2.459kB
// Pull complete
// Digest: sha256:d37ada95d47ad12224c205a938129df7a3e52345828b4fa27b03a98825d1e2e7
// Status: Downloaded newer image for confo014/hello-world:latest
const program = Effect.gen(function* () {
    const images: Images.ImagesImpl = yield* Images.Images;
    const system: System.SystemsImpl = yield* System.Systems;

    // Get an identity token from docker hub
    const authResponse: Schemas.RegistryAuthenticateOKBody = yield* system.auth(dockerHubLogin);
    yield* Console.log(authResponse);

    if (authResponse.Status === "Login Succeeded" && !authResponse.IdentityToken) {
        yield* Console.warn(
            "Login succeeded but no identity token was given, you must pass the base64 encoded auth options directly using the X-Registry-Auth header"
        );
    }

    // Pull the image using the images service
    const pullStream: Stream.Stream<Schemas.JSONMessage, Images.ImagesError, never> = images.create({
        fromImage: `docker.io/${dockerHubLogin.username}/hello-world:latest`,
        "X-Registry-Auth": authResponse.IdentityToken || Buffer.from(JSON.stringify(dockerHubLogin)).toString("base64"),
    });

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    yield* Convey.followProgressInConsole(pullStream);
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
