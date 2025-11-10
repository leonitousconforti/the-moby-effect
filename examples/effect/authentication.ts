// Run with: tsx examples/effect/authentication.ts

import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect, Function, Layer, Stream } from "effect";
import { DockerEngine, MobyConnection, MobyConvey, MobyEndpoints, MobySchemas } from "the-moby-effect";

// Connect to the local docker engine at "/var/run/docker.sock"
// const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
//     MobyConnection.SocketConnectionOptions({
//         socketPath: "/var/run/docker.sock",
//     })
// );
const localDocker = Function.pipe(
    MobyConnection.connectionOptionsFromPlatformSystemSocketDefault,
    Effect.map(DockerEngine.layerNodeJS),
    Layer.unwrapEffect
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
    const images: MobyEndpoints.Images = yield* MobyEndpoints.Images;
    const system: MobyEndpoints.System = yield* MobyEndpoints.System;

    // Get an identity token from docker hub
    const authResponse: MobySchemas.RegistryAuthenticateOKBody | void = yield* system.auth(dockerHubLogin);
    yield* Console.log(authResponse);

    if (authResponse?.Status === "Login Succeeded" && !authResponse.IdentityToken) {
        yield* Console.warn(
            "Login succeeded but no identity token was given, you must pass the base64 encoded auth options directly using the X-Registry-Auth header"
        );
    }

    // Pull the image using the images service
    const pullStream: Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, never> = images.create({
        fromImage: `docker.io/${dockerHubLogin.username}/hello-world:latest`,
        // "X-Registry-Auth":
        //     authResponse?.IdentityToken || Buffer.from(JSON.stringify(dockerHubLogin)).toString("base64"),
    });

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    yield* MobyConvey.followProgressInConsole(pullStream);
});

program.pipe(Effect.provide(localDocker)).pipe(NodeRuntime.runMain);
