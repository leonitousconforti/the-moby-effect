// Run with: pnpx tsx examples/callbacks/build-image.ts

import { Function, Stream } from "effect";

import * as url from "node:url";

import { NodeServices } from "@effect/platform-node";
import { Tar } from "eftar";
import { Callbacks, DockerEngine } from "the-moby-effect";

// Create a callbacks client from the local docker engine
const callbacksClient = await Callbacks.callbackClient(DockerEngine.layerNodeJS);

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

const cwd = url.fileURLToPath(new URL(".", import.meta.url));
const buildContext = Function.pipe(
    Tar.tarballFromFilesystem(cwd, ["build-image.dockerfile"]),
    Stream.provide(NodeServices.layer)
);

const buildStream = callbacksClient.build({
    context: buildContext,
    tag: "mydockerimage:latest",
    dockerfile: "build-image.dockerfile",
});

callbacksClient.followProgressInConsole(buildStream, (exit) => {
    console.log(exit);
});
