import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Cause from "effect/Cause";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as ReadonlyArray from "effect/ReadonlyArray";
import * as Schedule from "effect/Schedule";
import * as dgram from "node:dgram";
import * as stun from "stun";
import * as uuid from "uuid";
import * as wireguard from "wireguard-tools";
import * as helpers from "../shared/helpers.js";

const client_identifier = uuid.v4();
let timer: NodeJS.Timeout | undefined = undefined;

/**
 * Connection requests to a service will be made by uploading an artifact with a
 * name following the format
 * "service-identifier_connection-request_client-identifier" where
 * service-identifier is the uuid of the service to connect to and client
 * identifier is the uuid generated for this client.
 */
const uploadConnectionRequestArtifact: Effect.Effect<
    PlatformNode.FileSystem.FileSystem,
    ConfigError.ConfigError | PlatformNode.Error.PlatformError | Cause.UnknownException,
    void
> = Effect.gen(function* (_) {
    const service_identifier: string = yield* _(helpers.SERVICE_IDENTIFIER);
    const stunSocket: dgram.Socket = dgram.createSocket("udp4");
    stunSocket.bind(0);
    timer = setInterval(() => stunSocket.send(".", 0, 1, 80, "3.3.3.3"), 10_000);
    const stunResponse: stun.StunMessage = yield* _(
        Effect.promise(() => stun.request("stun.l.google.com:19302", { socket: stunSocket }))
    );
    const mappedAddress = stunResponse.getAttribute(stun.constants.STUN_ATTR_XOR_MAPPED_ADDRESS).value;
    const myLocation: string = `${mappedAddress.address}:${mappedAddress.port}:${stunSocket.address().port}`;
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
    const artifacts = yield* _(helpers.listArtifacts);
    const service_identifier: string = yield* _(helpers.SERVICE_IDENTIFIER);

    const [, isConnectionResponse] = helpers.connectionResponseArtifact(service_identifier, client_identifier);

    const connectionResponses = ReadonlyArray.filter(artifacts, isConnectionResponse);
    if (connectionResponses.length >= 2) {
        yield* _(
            Effect.die(
                new Error(
                    `Received more than one connection response artifact for client: ${client_identifier} from service: ${service_identifier}`
                )
            )
        );
    }

    // Even if there are more than two connection response artifacts, we will only take the first
    const connectionResponse = connectionResponses[0];
    if (connectionResponse) {
        clearInterval(timer);
        const data = yield* _(helpers.downloadSingleFileArtifact(connectionResponse.id, connectionResponse.name));
        yield* _(helpers.deleteArtifact(connectionResponse.name));
        core.info(data);
        const parsed = data.match(/AllowedIPs = (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/\d{1,3}/);
        if (!parsed) {
            return yield* _(Effect.fail(new Error("Invalid connection response artifact contents")));
        }
        if (parsed[1]) {
            core.info(parsed[1]);
            core.setOutput("service-address", parsed[1]);
            const a = wireguard.parseConfigString(data);
            const config = new wireguard.WgConfig(a);
            yield* _(Effect.promise(() => config.writeToFile("./wg0.conf")));
            yield* _(Effect.promise(() => config.up("./wg0")));
            return;
        } else {
            yield* _(Effect.fail(new Error("Invalid connection response artifact contents")));
        }
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
