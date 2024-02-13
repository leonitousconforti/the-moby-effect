import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Schedule from "effect/Schedule";
import * as dgram from "node:dgram";
import * as stun from "stun";
import * as uuid from "uuid";
import * as wireguard from "wireguard-tools";
import * as helpers from "../shared/helpers.js";

/**
 * The service should continue to listen for connection requests and host the
 * supplied service as long as there is not an artifact uploaded to the workflow
 * run with a name in the format of "service-identifier_stop" where
 * service_identifier is the UUID of the service to stop.
 */
const hasStopRequest = Effect.gen(function* (_) {
    const { artifacts } = yield* _(helpers.listArtifacts);
    const service_identifier = yield* _(helpers.SERVICE_IDENTIFIER);

    if (artifacts.some((artifact) => artifact.name === `${service_identifier}_stop`)) {
        core.info(`Stop request received, stopping service ${service_identifier}`);
        yield* _(helpers.deleteArtifact(`${service_identifier}_stop`));
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
    const service_subnet = yield* _(helpers.SERVICE_SUBNET);
    const service_identifier = yield* _(helpers.SERVICE_IDENTIFIER);

    const { artifacts } = yield* _(helpers.listArtifacts);
    const connectionRequests = artifacts.filter((artifact) =>
        artifact.name.startsWith(`${service_identifier}_connection-request`)
    );

    for (const connectionRequest of connectionRequests) {
        const client_identifier = connectionRequest.name.split("_")[2];
        if (!client_identifier || !uuid.validate(client_identifier)) {
            yield* _(helpers.deleteArtifact(connectionRequest.name));
            throw new Error("Invalid client identifier in connection request artifact name");
        }

        core.info(`Processing connection request from client ${client_identifier}`);
        const data = yield* _(helpers.downloadSingleFileArtifact(connectionRequest.id, connectionRequest.name));
        yield* _(helpers.deleteArtifact(connectionRequest.name));

        const [clientIp, natPort, hostPort] = data.split(":");
        if (!clientIp || !natPort || !hostPort) {
            throw new Error("Invalid connection request artifact contents");
        }

        const stunSocket = dgram.createSocket("udp4");
        stunSocket.bind(0);
        const stunResponse = yield* _(
            Effect.promise(() => stun.request("stun.l.google.com:19302", { socket: stunSocket }))
        );
        const mappedAddress = stunResponse.getAttribute(stun.constants.STUN_ATTR_XOR_MAPPED_ADDRESS).value;
        const myLocation = `${mappedAddress.address}:${mappedAddress.port}`;
        yield* _(
            Effect.loop(0, {
                step: (i) => i + 1,
                while: (i) => i < 5,
                body: () =>
                    Effect.sync(() => stunSocket.send(".", 0, 1, Number.parseInt(natPort), clientIp)).pipe(
                        Effect.andThen(Effect.sleep(10_000))
                    ),
            })
        );

        const hostKeys = yield* _(Effect.promise(() => wireguard.generateKeyPair()));
        const peerKeys = yield* _(Effect.promise(() => wireguard.generateKeyPair()));

        const hostConfig = new wireguard.WgConfig({
            filePath: "/etc/wireguard/wg0.conf",
            wgInterface: {
                name: "wg0",
                address: [service_subnet.replace(/.$/, ".1/30")],
                privateKey: hostKeys.privateKey,
                listenPort: stunSocket.address().port,
            },
            peers: [
                {
                    publicKey: peerKeys.publicKey,
                    allowedIps: [service_subnet.replace(/.$/, ".2/32")],
                },
            ],
        });

        const peerConfig = new wireguard.WgConfig({
            wgInterface: {
                name: "wg0",
                address: [service_subnet.replace(/.$/, ".2/30")],
                privateKey: peerKeys.privateKey,
                listenPort: Number.parseInt(hostPort),
            },
            peers: [
                {
                    endpoint: myLocation,
                    persistentKeepalive: 25,
                    publicKey: hostKeys.publicKey,
                    allowedIps: [service_subnet.replace(/.$/, ".1/32")],
                },
            ],
        });

        yield* _(Effect.promise(() => hostConfig.writeToFile()));
        stunSocket.close();
        yield* _(Effect.promise(() => hostConfig.up()));

        yield* _(
            helpers.uploadSingleFileArtifact(
                `${service_identifier}_connection-response_${client_identifier}`,
                peerConfig.toString()
            )
        );
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
