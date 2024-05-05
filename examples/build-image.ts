import * as url from "node:url";
import * as tar from "tar-fs";

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

// {"stream":"Step 1/1 : FROM ubuntu:latest"}
// {"stream":"\n"}
// {"status":"Pulling from library/ubuntu","id":"latest"}
// {"status":"Pulling fs layer","progressDetail":{},"id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":311296,"total":29547417},"progress":"[\u003e                                                  ]  311.3kB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":3107142,"total":29547417},"progress":"[=====\u003e                                             ]  3.107MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":5880134,"total":29547417},"progress":"[=========\u003e                                         ]   5.88MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":8644934,"total":29547417},"progress":"[==============\u003e                                    ]  8.645MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":10492230,"total":29547417},"progress":"[=================\u003e                                 ]  10.49MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":13240646,"total":29547417},"progress":"[======================\u003e                            ]  13.24MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":15989062,"total":29547417},"progress":"[===========================\u003e                       ]  15.99MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":18454854,"total":29547417},"progress":"[===============================\u003e                   ]  18.45MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":21215558,"total":29547417},"progress":"[===================================\u003e               ]  21.22MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":24000838,"total":29547417},"progress":"[========================================\u003e          ]     24MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Downloading","progressDetail":{"current":26769734,"total":29547417},"progress":"[=============================================\u003e     ]  26.77MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Download complete","progressDetail":{},"id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":327680,"total":29547417},"progress":"[\u003e                                                  ]  327.7kB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":7536640,"total":29547417},"progress":"[============\u003e                                      ]  7.537MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":12451840,"total":29547417},"progress":"[=====================\u003e                             ]  12.45MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":23265280,"total":29547417},"progress":"[=======================================\u003e           ]  23.27MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":25886720,"total":29547417},"progress":"[===========================================\u003e       ]  25.89MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":29163520,"total":29547417},"progress":"[=================================================\u003e ]  29.16MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Extracting","progressDetail":{"current":29547417,"total":29547417},"progress":"[==================================================\u003e]  29.55MB/29.55MB","id":"5e8117c0bd28"}
// {"status":"Pull complete","progressDetail":{},"id":"5e8117c0bd28"}
// {"status":"Digest: sha256:8eab65df33a6de2844c9aefd19efe8ddb87b7df5e9185a4ab73af936225685bb"}
// {"status":"Status: Downloaded newer image for ubuntu:latest"}
// {"stream":" ---\u003e b6548eacb063\n"}
// {"aux":{"ID":"sha256:b6548eacb0639263e9d8abfee48f8ac8b327102a05335b67572f715c580a968e"}}
// {"stream":"Successfully built b6548eacb063\n"}
// {"stream":"Successfully tagged mydockerimage:latest\n"}
const program = Effect.gen(function* (_: Effect.Adapter) {
    const images: Images.Images = yield* _(Images.Images);

    const buildStream: Stream.Stream<Schemas.BuildInfo, Images.ImagesError, never> = yield* _(
        images.build({
            t: "mydockerimage:latest",
            context: Stream.fromAsyncIterable(
                tar.pack(url.fileURLToPath(new URL(".", import.meta.url)), {
                    entries: ["build-image.dockerfile"],
                }),
                () =>
                    new Images.ImagesError({
                        method: "buildStream",
                        message: "error packing the build context",
                    })
            ),
            dockerfile: "build-image.dockerfile",
        })
    );

    // You could fold/iterate over the stream here too if you wanted progress events in real time
    return yield* _(Stream.runCollect(buildStream).pipe(Effect.map(Chunk.toReadonlyArray)));
});

program.pipe(Effect.tap(Console.log)).pipe(Effect.provide(localDocker)).pipe(Effect.scoped).pipe(NodeRuntime.runMain);
