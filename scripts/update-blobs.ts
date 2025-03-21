import * as NodeContext from "@effect/platform-node/NodeContext";
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Effect from "effect/Effect";

import * as HttpBlob from "../src/blobs/Http.js";
import * as HttpsBlob from "../src/blobs/Https.js";
import * as SocketBlob from "../src/blobs/Socket.js";
import * as SshBlob from "../src/blobs/Ssh.js";

const program = Effect.gen(function* () {
    const path = yield* Path.Path;
    const fileSystem = yield* FileSystem.FileSystem;
    const cwd = yield* path.fromFileUrl(new URL(".", import.meta.url));
    const outputFolder = path.join(cwd, "..", "docker");

    yield* fileSystem.writeFileString(path.join(outputFolder, "dind-http.dockerfile"), HttpBlob.content);
    yield* fileSystem.writeFileString(path.join(outputFolder, "dind-https.dockerfile"), HttpsBlob.content);
    yield* fileSystem.writeFileString(path.join(outputFolder, "dind-ssh.dockerfile"), SshBlob.content);
    yield* fileSystem.writeFileString(path.join(outputFolder, "dind-socket.dockerfile"), SocketBlob.content);
});

program.pipe(Effect.provide(NodeContext.layer)).pipe(NodeRuntime.runMain);
