import * as artifacts from "@actions/artifact";
import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Schedule from "effect/Schedule";
import * as dgram from "node:dgram";
import * as path from "node:path";
import * as stun from "stun";
import * as uuid from "uuid";

const client_identifier = uuid.v4();
const artifactClient = new artifacts.DefaultArtifactClient();
const SERVICE_IDENTIFIER = Config.string("SERVICE_IDENTIFIER");

/**
 * Connection requests to a service will be made by uploading an artifact with a
 * name following the format
 * "service-identifier_connection-request_client-identifier" where
 * service-identifier is the uuid of the service to connect to and client
 * identifier is the uuid generated for this client.
 */
const uploadConnectionRequestArtifact = Effect.gen(function* (_) {
    const fs = yield* _(PlatformNode.FileSystem.FileSystem);
    const service_identifier = yield* _(SERVICE_IDENTIFIER);
    const tempDirectory = yield* _(fs.makeTempDirectoryScoped());
    const artifactFile = path.join(tempDirectory, `${service_identifier}_connection-request_${client_identifier}`);
    const stunSocket = dgram.createSocket("udp4");
    stunSocket.bind(0);
    const stunResponse = yield* _(Effect.promise(() => stun.request("stun.ekiga.net", { socket: stunSocket })));
    const mappedAddress = stunResponse.getAttribute(stun.constants.STUN_ATTR_MAPPED_ADDRESS).value;
    const myLocation = `${mappedAddress.address}:${mappedAddress.port}:${stunSocket.address().port}`;
    yield* _(fs.writeFileString(artifactFile, myLocation));
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
const waitForResponse = Effect.gen(function* (_) {
    const { artifacts } = yield* _(Effect.promise(() => artifactClient.listArtifacts()));
    const service_identifier = yield* _(SERVICE_IDENTIFIER);
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
        const data = yield* _(Effect.promise(() => artifactClient.downloadArtifact(connectionResponse.id)));
        yield* _(Effect.promise(() => artifactClient.deleteArtifact(connectionResponse.name)));
        core.info(JSON.stringify(data));
        return;
    }

    // Still waiting for a connection response
    yield* _(Effect.fail(new Error("Still waiting for a connection response")));
});

Function.pipe(
    Effect.scoped(uploadConnectionRequestArtifact),
    Effect.andThen(
        Effect.retry(waitForResponse, { times: 100, schedule: Schedule.forever.pipe(Schedule.addDelay(() => 30_000)) })
    ),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
