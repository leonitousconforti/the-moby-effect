import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";
import * as dgram from "node:dgram";
import * as stun from "stun";
import * as uuid from "uuid";
import * as helpers from "../shared/helpers.js";

/** @type {NodeJS.Timeout | undefined} */
let timer = undefined;
const client_identifier = uuid.v4();

/**
 * Connection requests to a service will be made by uploading an artifact with a
 * name following the format
 * "service-identifier_connection-request_client-identifier" where
 * service-identifier is the uuid of the service to connect to and client
 * identifier is the uuid generated for this client.
 */
const uploadConnectionRequestArtifact = Effect.gen(function* (_) {
    const service_identifier = yield* _(helpers.SERVICE_IDENTIFIER);
    const stunSocket = dgram.createSocket("udp4");
    stunSocket.bind(0);
    timer = setInterval(() => stunSocket.send(".", 0, 1, 80, "3.3.3.3"), 10_000);
    const stunResponse = yield* _(
        Effect.promise(() => stun.request("stun.l.google.com:19302", { socket: stunSocket }))
    );
    console.log(stunResponse);
    const mappedAddress = stunResponse.getAttribute(stun.constants.STUN_ATTR_MAPPED_ADDRESS).value;
    const myLocation = `${mappedAddress.address}:${mappedAddress.port}:${stunSocket.address().port}`;
    yield* _(
        helpers.uploadSingleFileArtifact(`${service_identifier}_connection-request_${client_identifier}`, myLocation)
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
    const { artifacts } = yield* _(helpers.listArtifacts);
    const service_identifier = yield* _(helpers.SERVICE_IDENTIFIER);
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
        clearInterval(timer);
        const data = yield* _(helpers.downloadSingleFileArtifact(connectionResponse.id, connectionResponse.name));
        yield* _(helpers.deleteArtifact(connectionResponse.name));
        core.info(data);
        return;
    }

    // Still waiting for a connection response
    yield* _(Effect.fail(new Error("Still waiting for a connection response")));
});

Effect.suspend(() => uploadConnectionRequestArtifact).pipe(
    Effect.andThen(
        Effect.retry(waitForResponse, { times: 100, schedule: Schedule.forever.pipe(Schedule.addDelay(() => 30_000)) })
    ),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
