import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";

import * as Tar from "../src/archive/Tar.js";
import * as Untar from "../src/archive/Untar.js";

const program = Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const stream = fs.stream("output.tar");

    console.log("here0");
    const results1 = yield* Untar.Untar(stream);
    console.log("here1");
    const results2 = Tar.Tar(results1);
    console.log("here2");
    const results3 = yield* Untar.Untar(results2);
    console.log("here3");

    for (const result of results3) {
        console.log(result);
    }
});

program.pipe(Effect.provide(NodeContext.layer)).pipe(NodeRuntime.runMain);
