import * as artifacts from "@actions/artifact";
import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Effect from "effect/Effect";

const service_identifier = core.getInput("service-identifier", { required: true });
const artifactClient = new artifacts.DefaultArtifactClient();

const main = Effect.gen(function* (_) {
    const fs = yield* _(PlatformNode.FileSystem.FileSystem);
    const tempFile = yield* _(fs.makeTempFileScoped());
    yield* _(
        Effect.promise(() =>
            artifactClient.uploadArtifact(`${service_identifier}_stop`, [tempFile], "/", {
                retentionDays: 1,
            })
        )
    );
});

Effect.suspend(() => main)
    .pipe(Effect.scoped)
    .pipe(Effect.provide(PlatformNode.NodeContext.layer))
    .pipe(PlatformNode.Runtime.runMain);
