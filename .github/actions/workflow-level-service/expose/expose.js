import * as artifacts from "@actions/artifact";
import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Schedule from "effect/Schedule";
import * as path from "node:path";
import * as uuid from "uuid";

const artifactClient = new artifacts.DefaultArtifactClient();
const SERVICE_IDENTIFIER = Config.string("SERVICE_IDENTIFIER");

/**
 * The service should continue to listen for connection requests and host the
 * supplied service as long as there is not an artifact uploaded to the workflow
 * run with a name in the format of "service-identifier_stop" where
 * service_identifier is the UUID of the service to stop.
 */
const hasStopRequest = Effect.gen(function* (_) {
    const service_identifier = yield* _(SERVICE_IDENTIFIER);
    const { artifacts } = yield* _(Effect.promise(() => artifactClient.listArtifacts()));

    if (artifacts.some((artifact) => artifact.name === `${service_identifier}_stop`)) {
        core.info(`Stop request received, stopping service ${service_identifier}`);
        yield* _(Effect.promise(() => artifactClient.deleteArtifact(`${service_identifier}_stop`)));
        return true;
    }

    return false;
});

/**
 * Connection requests will show up as artifacts with a name in the format
 * "service-identifier_connection-request_client-identifier" where
 * service_identifier is the UUID of the service to connect to and
 * client_identifier is the UUID of the client making the request. We use a
 * client identifier on the connection requests to prevent github actions from
 * merge artifacts with duplicate names, which could happen as multiple clients
 * might try to connect to the same service. The contents of the artifact will
 * be a string in the format "client-ip:nat-port:host-port". Once we have a
 * connection request, we will start blasting udp packets in the direction of
 * the client and upload a response artifact with the name
 * "service-identifier_connection-response_client-identifier" and the contents
 * of the artifact will be a connection string. The client will then use the
 * information in the response artifact to establish a connection with the
 * service.
 */
const processConnectionRequest = Effect.gen(function* (_) {
    const fs = yield* _(PlatformNode.FileSystem.FileSystem);
    const service_identifier = yield* _(SERVICE_IDENTIFIER);

    const { artifacts } = yield* _(Effect.promise(() => artifactClient.listArtifacts()));
    const connectionRequests = artifacts.filter((artifact) =>
        artifact.name.startsWith(`${service_identifier}_connection-request`)
    );

    for (const connectionRequest of connectionRequests) {
        const client_identifier = connectionRequest.name.split("_")[2];
        if (!client_identifier || !uuid.validate(client_identifier)) {
            throw new Error("Invalid client identifier in connection request artifact name");
        }

        core.info(`Processing connection request from client ${client_identifier}`);
        const { downloadPath } = yield* _(Effect.promise(() => artifactClient.downloadArtifact(connectionRequest.id)));
        yield* _(Effect.promise(() => artifactClient.deleteArtifact(connectionRequest.name)));

        if (!downloadPath) {
            throw new Error("Failed to download connection request artifact");
        }

        const tempFile = yield* _(fs.makeTempFile());
        yield* _(
            Effect.promise(() =>
                artifactClient.uploadArtifact(
                    `${service_identifier}_connection-response_${client_identifier}`,
                    [tempFile],
                    "/",
                    {
                        retentionDays: 1,
                    }
                )
            )
        );
        yield* _(fs.remove(tempFile));

        const data = yield* _(fs.readFileString(path.join(downloadPath, connectionRequest.name)));
        const [clientIp, natPort, hostPort] = data.split(":");
        if (!clientIp || !natPort || !hostPort) {
            // throw new Error("Invalid connection request artifact contents");
        }

        core.info(data);
    }
});

/**
 * Processes connection requests every 30 seconds until there is a stop request
 * or we have a defect (unexpected error).
 */
Effect.suspend(() => processConnectionRequest).pipe(
    Effect.schedule(
        Function.pipe(
            Schedule.recurUntilEffect(() => Effect.orDie(hasStopRequest)),
            Schedule.addDelay(() => 30_000)
        )
    ),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
