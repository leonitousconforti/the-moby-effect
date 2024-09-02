import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as HashMap from "effect/HashMap";
import * as Stream from "effect/Stream";

import * as HttpBlob from "../src/blobs/Http.js";
import * as Convey from "../src/Convey.js";

Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const stream = Convey.packBuildContextIntoTarballStream(HashMap.make(["Dockerfile", HttpBlob.content]));
    const stream2 = Stream.mapConcat(stream, Function.identity);
    const data = yield* Stream.runCollect(stream2);
    const data2 = Chunk.toReadonlyArray(data);
    const data3 = Uint8Array.from(data2);
    yield* fs.writeFile("./asdf.tar", data3);
})
    .pipe(Effect.provide(NodeContext.layer))
    .pipe(NodeRuntime.runMain);
