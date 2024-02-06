import * as artifacts from "@actions/artifact";
import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";
import * as path from "node:path";
import * as uuid from "uuid";

const client_identifier = uuid.v4();
const artifactClient = new artifacts.DefaultArtifactClient();
const service_identifier = core.getInput("service-identifier");

/**
 * Connection requests to a service will be made by uploading an artifact with a
 * name following the format
 * "service-identifier_connection-request_client-identifier" where
 * service-identifier is the uuid of the service to connect to and client
 * identifier is the uuid generated for this client.
 */
const uploadConnectionRequestArtifact = Effect.gen(function* (_) {
    const fs = yield* _(PlatformNode.FileSystem.FileSystem);
    const tempDirectory = yield* _(fs.makeTempDirectoryScoped());
    const artifactFile = path.join(tempDirectory, `${service_identifier}_connection-request_${client_identifier}`);
    yield* _(fs.writeFileString(artifactFile, "AAAAAAAA"));
    yield* _(
        Effect.promise(() =>
            artifactClient.uploadArtifact(
                `${service_identifier}_connection-request_${client_identifier}`,
                [artifactFile],
                tempDirectory,
                { retentionDays: 1 }
            )
        )
    );
});

/**
 * Once our connection request has been uploaded, we will wait for a response
 * artifact to be uploaded from the service. This should take no more than 30
 * seconds, as that is the interval at which the service node will process
 * connection requests. Once we have a connection response, we can execute the
 * connection string inside and that should be everything needed to connect to
 * the service.
 */
const waitForResponse = async () => {
    const { artifacts } = await artifactClient.listArtifacts();
    const connectionResponses = artifacts.filter(
        (artifact) => artifact.name === `${service_identifier}_connection-response_${client_identifier}`
    );

    if (connectionResponses.length >= 2) {
        core.warning(
            `Received more than one connection response artifact for client: ${client_identifier} from service: ${service_identifier}`
        );
    }

    // Even if there are more than two connection response artifacts, we will only take the first
    const connectionResponse = connectionResponses[0];
    if (connectionResponse) {
        const data = await artifactClient.downloadArtifact(connectionResponse.id);
        await artifactClient.deleteArtifact(connectionResponse.name);
        core.info(JSON.stringify(data));
        return;
    }

    // Still waiting for a connection response
    throw new Error("Still waiting for a connection response");
};

Effect.suspend(() => uploadConnectionRequestArtifact).pipe(
    Effect.scoped,
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);

core.info("here");

Effect.suspend(() => Effect.tryPromise(waitForResponse)).pipe(
    Effect.retry({ times: 100, schedule: Schedule.forever.pipe(Schedule.addDelay(() => 30_000)) }),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
