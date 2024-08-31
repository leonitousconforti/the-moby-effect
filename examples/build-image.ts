// Run with: tsx examples/build-image.ts

import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";

import * as Convey from "the-moby-effect/Convey";
import * as DockerEngine from "the-moby-effect/DockerEngine";
import * as Platforms from "the-moby-effect/Platforms";

// Connect to the local docker engine at "/var/run/docker.sock"
const localDocker: DockerEngine.DockerLayer = DockerEngine.layerNodeJS(
    Platforms.SocketConnectionOptions({
        socketPath: "/var/run/docker.sock",
    })
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
    const buildContext = Convey.packBuildContextIntoTarballStream(cwd, ["build-image.dockerfile"]);
    const buildStream = yield* DockerEngine.buildScoped({
        context: buildContext,
        tag: "mydockerimage:latest",
        dockerfile: "build-image.dockerfile",
    });

    yield* Convey.followProgressInConsole(buildStream);
});

program
    .pipe(Effect.scoped)
    .pipe(Effect.provide(localDocker))
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
