import * as artifacts from "@actions/artifact";
import * as PlatformNode from "@effect/platform-node";
import * as Cause from "effect/Cause";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Predicate from "effect/Predicate";
import * as path from "node:path";
import * as uuid from "uuid";

/**
 * Retrieves the service identifier from the environment variable and validates
 * that it is a valid UUID.
 */
export const SERVICE_IDENTIFIER: Config.Config<string> = Config.string("SERVICE_IDENTIFIER").pipe(
    Config.mapAttempt((identifier) => {
        if (!uuid.validate(identifier)) {
            throw new Error("Invalid service identifier");
        }
        return identifier;
    })
);

/** Predicate to check if an artifact is a stop artifact for the service. */
export const stopArtifact = (
    service_identifier: string
): [stopArtifactName: string, isStopArtifact: Predicate.Predicate<artifacts.Artifact>] => [
    `${service_identifier}_stop`,
    (artifact: artifacts.Artifact) => artifact.name === `${service_identifier}_stop`,
];

/** Predicate to check if an artifact is a connection request for the service. */
export const connectionRequestArtifact = (
    service_identifier: string
): [connectionRequestName: string, isConnectionRequest: Predicate.Predicate<artifacts.Artifact>] => [
    `${service_identifier}_connection-request`,
    (artifact: artifacts.Artifact) => artifact.name.startsWith(`${service_identifier}_connection-request`),
];

/** Predicate to check if an artifact is a connection response for the service. */
export const connectionResponseArtifact = (
    service_identifier: string,
    client_identifier: string
): [connectionResponseName: string, isConnectionResponse: Predicate.Predicate<artifacts.Artifact>] => [
    `${service_identifier}_connection-response_${client_identifier}`,
    (artifact: artifacts.Artifact) =>
        artifact.name === `${service_identifier}_connection-response_${client_identifier}`,
];

/** Global artifact client. */
const artifactClient = new artifacts.DefaultArtifactClient();

/** List all artifacts in the current workflow. */
export const listArtifacts: Effect.Effect<
    never,
    Cause.UnknownException,
    ReadonlyArray<artifacts.Artifact>
> = Effect.tryPromise(() => artifactClient.listArtifacts()).pipe(Effect.map(({ artifacts }) => artifacts));

/** Delete an artifact by name. */
export const deleteArtifact = (artifactName: string) =>
    Effect.tryPromise(() => artifactClient.deleteArtifact(artifactName));

/** Download a single file artifact by ID and extracts the desired file. */
export const downloadSingleFileArtifact = (artifactId: number, artifactFile: string) =>
    Effect.gen(function* (_) {
        const fs = yield* _(PlatformNode.FileSystem.FileSystem);
        const { downloadPath } = yield* _(Effect.tryPromise(() => artifactClient.downloadArtifact(artifactId)));
        if (!downloadPath) {
            return yield* _(Effect.fail(new Error("Failed to download connection request artifact")));
        }
        return yield* _(fs.readFileString(path.join(downloadPath, artifactFile)));
    });

/** Upload a single file artifact. */
export const uploadSingleFileArtifact = (artifactName: string, data: string) =>
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
