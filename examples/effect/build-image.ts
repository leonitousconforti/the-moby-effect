// Run with: npx tsx examples/effect/build-image.ts

import { Path } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect, Function, Layer, Stream } from "effect";
import { DockerEngine, MobyConnection, MobyConvey } from "the-moby-effect";

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

// Step 1/1 : FROM ubuntu:latest
// Pulling from library/ubuntu
// Pulling fs layer
// Downloading [>                                                  ]  298.2kB/29.71MB
// Downloading [=====>                                             ]  3.092MB/29.71MB
// Downloading [=========>                                         ]  5.889MB/29.71MB
// Downloading [==============>                                    ]  8.674MB/29.71MB
// Downloading [===================>                               ]  11.45MB/29.71MB
// Downloading [=======================>                           ]  14.22MB/29.71MB
// Downloading [============================>                      ]  16.99MB/29.71MB
// Downloading [=================================>                 ]  19.77MB/29.71MB
// Downloading [=====================================>             ]  22.25MB/29.71MB
// Downloading [=========================================>         ]  24.74MB/29.71MB
// Downloading [==============================================>    ]  27.51MB/29.71MB
// Verifying Checksum
// Download complete
// Extracting [>                                                  ]  327.7kB/29.71MB
// Extracting [===============>                                   ]  9.503MB/29.71MB
// Extracting [===================================>               ]   21.3MB/29.71MB
// Extracting [===========================================>       ]  25.56MB/29.71MB
// Extracting [=================================================> ]  29.49MB/29.71MB
// Extracting [==================================================>]  29.71MB/29.71MB
// Pull complete
// Digest: sha256:2e863c44b718727c860746568e1d54afd13b2fa71b160f5cd9058fc436217b30
// Status: Image is up to date for ubuntu:latest
//  ---> 35a88802559d
// sha256:35a88802559dd2077e584394471ddaa1a2c5bfd16893b829ea57619301eb3908
// Successfully built 35a88802559d
// Successfully tagged mydockerimage:latest
const program = Effect.gen(function* () {
    const path: Path.Path = yield* Path.Path;

    const cwd = yield* path.fromFileUrl(new URL(".", import.meta.url));
    const buildContext = Function.pipe(
        MobyConvey.packIntoTarballStream(cwd, ["build-image.dockerfile"]),
        Stream.provideLayer(NodeContext.layer)
    );

    const buildStream = yield* DockerEngine.buildScoped({
        context: buildContext,
        tag: "mydockerimage:latest",
        dockerfile: "build-image.dockerfile",
    });

    yield* MobyConvey.followProgressInConsole(buildStream);
});

program
    .pipe(Effect.scoped)
    .pipe(Effect.provide(localDocker))
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
