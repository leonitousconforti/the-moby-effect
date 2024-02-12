import * as artifacts from "@actions/artifact";
import * as PlatformNode from "@effect/platform-node";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as path from "node:path";
import * as uuid from "uuid";

const artifactClient = new artifacts.DefaultArtifactClient();

/**
 * Retrieves the service identifier from the environment variable and validates
 * that it is a valid UUID.
 */
export const SERVICE_IDENTIFIER = Config.string("SERVICE_IDENTIFIER").pipe(
    Config.mapAttempt((identifier) => {
        if (!uuid.validate(identifier)) {
            throw new Error("Invalid service identifier");
        }
        return identifier;
    })
);

export const listArtifacts = Effect.tryPromise(() => artifactClient.listArtifacts());

export const deleteArtifact = (/** @type {string} */ artifactName) =>
    Effect.tryPromise(() => artifactClient.deleteArtifact(artifactName));

export const downloadSingleFileArtifact = (/** @type {number} */ artifactId, /** @type {string} */ artifactFile) =>
    Effect.gen(function* (_) {
        const fs = yield* _(PlatformNode.FileSystem.FileSystem);
        const { downloadPath } = yield* _(Effect.tryPromise(() => artifactClient.downloadArtifact(artifactId)));
        if (!downloadPath) {
            return yield* _(Effect.fail(new Error("Failed to download connection request artifact")));
        }
        return yield* _(fs.readFileString(path.join(downloadPath, artifactFile)));
    });

export const uploadSingleFileArtifact = (/** @type {string} */ artifactName, /** @type {string} */ data) =>
    Effect.gen(function* (_) {
        const fs = yield* _(PlatformNode.FileSystem.FileSystem);
        const tempDirectory = yield* _(fs.makeTempDirectoryScoped());
        const artifactFile = path.join(tempDirectory, artifactName);
        yield* _(fs.writeFileString(artifactFile, data));
        yield* _(
            Effect.tryPromise(() =>
                artifactClient.uploadArtifact(artifactName, [artifactFile], tempDirectory, { retentionDays: 1 })
            )
        );
    }).pipe(Effect.scoped);
