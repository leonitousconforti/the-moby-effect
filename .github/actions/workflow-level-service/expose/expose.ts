import * as artifacts from "@actions/artifact";
import * as core from "@actions/core";
import * as PlatformNode from "@effect/platform-node";
import * as Cause from "effect/Cause";
import * as ConfigError from "effect/ConfigError";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as ReadonlyArray from "effect/ReadonlyArray";
import * as Schedule from "effect/Schedule";
import * as dgram from "node:dgram";
import * as stun from "stun";
import * as uuid from "uuid";
import * as wireguard from "wireguard-tools";
import * as helpers from "../shared/helpers.js";

const processConnectionRequest = (
    connectionRequest: Readonly<artifacts.Artifact>
): Effect.Effect<
    PlatformNode.FileSystem.FileSystem,
    Error | ConfigError.ConfigError | Cause.UnknownException | PlatformNode.Error.PlatformError,
    void
> =>
    Effect.gen(function* (_) {
        const service_subnet: string = yield* _(helpers.SERVICE_SUBNET);
        const service_identifier: string = yield* _(helpers.SERVICE_IDENTIFIER);
        const client_identifier: string | undefined = connectionRequest.name.split("_")[2];

        // Check that client_identifier is a valid UUID
        if (!client_identifier || !uuid.validate(client_identifier)) {
            yield* _(helpers.deleteArtifact(connectionRequest.name));
            return yield* _(Effect.fail(new Error("Invalid client identifier in connection request artifact name")));
        }

        core.info(`Processing connection request from client ${client_identifier}`);
        const data = yield* _(helpers.downloadSingleFileArtifact(connectionRequest.id, connectionRequest.name));
        yield* _(helpers.deleteArtifact(connectionRequest.name));

        // Check that the connection request artifact contents are valid
        const [clientIp, natPort, hostPort] = data.split(":");
        if (!clientIp || !natPort || !hostPort) {
            return yield* _(Effect.fail(new Error("Invalid connection request artifact contents")));
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
                        Effect.andThen(Effect.sleep(7_000))
                    ),
            })
        );

        const hostKeys = yield* _(Effect.promise(() => wireguard.generateKeyPair()));
        const peerKeys = yield* _(Effect.promise(() => wireguard.generateKeyPair()));

        const hostConfig = new wireguard.WgConfig({
            filePath: `/etc/wireguard/wg-${service_identifier}-${client_identifier}.conf`,
            wgInterface: {
                name: `wg-${service_identifier}-${client_identifier}`.replaceAll("-", ""),
                address: [service_subnet.replace(/.$/, "1/30")],
                privateKey: hostKeys.privateKey,
                listenPort: stunSocket.address().port,
            },
            peers: [
                {
                    publicKey: peerKeys.publicKey,
                    allowedIps: [service_subnet.replace(/.$/, "2/32")],
                },
            ],
        });

        const peerConfig = new wireguard.WgConfig({
            wgInterface: {
                name: `wg-${service_identifier}-${client_identifier}`.replaceAll("-", ""),
                address: [service_subnet.replace(/.$/, "2/30")],
                privateKey: peerKeys.privateKey,
                listenPort: Number.parseInt(hostPort),
            },
            peers: [
                {
                    endpoint: myLocation,
                    persistentKeepalive: 25,
                    publicKey: hostKeys.publicKey,
                    allowedIps: [service_subnet.replace(/.$/, "1/32")],
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
    });

class HasStopRequest extends Data.TaggedError("HasStopRequest")<{ message: string }> {}

const program: Effect.Effect<
    PlatformNode.FileSystem.FileSystem,
    ConfigError.ConfigError | Cause.UnknownException | HasStopRequest,
    void
> = Effect.gen(function* (_: Effect.Adapter) {
    const service_identifier: string = yield* _(helpers.SERVICE_IDENTIFIER);
    const artifacts: ReadonlyArray<artifacts.Artifact> = yield* _(helpers.listArtifacts);

    const [stopRequestName, isStopRequest] = helpers.stopArtifact(service_identifier);
    const [, isConnectionRequest] = helpers.connectionRequestArtifact(service_identifier);

    /**
     * The service should continue to listen for connection requests and host
     * the supplied service as long as there is not an artifact uploaded to the
     * workflow run with a name in the format of "service-identifier_stop" where
     * service_identifier is the UUID of the service to stop.
     */
    if (ReadonlyArray.some(artifacts, isStopRequest)) {
        core.info(`Stop request received, stopping service ${service_identifier}`);
        yield* _(helpers.deleteArtifact(stopRequestName));
        yield* _(new HasStopRequest({ message: "Stop request received" }));
    }

    /**
     * Connection requests will show up as artifacts with a name in the format
     * "service-identifier_connection-request_client-identifier" where
     * service_identifier is the UUID of the service to connect to and
     * client_identifier is the UUID of the client making the request. We use a
     * client identifier on the connection requests to prevent github actions
     * from merge artifacts with duplicate names, which could happen as multiple
     * clients might try to connect to the same service. The contents of the
     * artifact will be a string in the format "client-ip:nat-port:host-port".
     */
    const connectionRequests = ReadonlyArray.filter(artifacts, isConnectionRequest);

    /**
     * Once we have a connection request, we will start blasting udp packets in
     * the direction of the client and upload a response artifact with the name
     * "service-identifier_connection-response_client-identifier" and the
     * contents of the artifact will be a connection string. The client will
     * then use the information in the response artifact to establish a
     * connection with the service.
     */
    yield* _(
        Function.pipe(
            connectionRequests,
            ReadonlyArray.map(processConnectionRequest),
            ReadonlyArray.map(Effect.forkDaemon),
            Effect.all
        )
    );
}).pipe(
    Effect.retry({
        schedule: Schedule.spaced("30 seconds"),
        until: (e) => e._tag === "HasStopRequest",
    })
);

/**
 * Processes connection requests every 30 seconds until there is a stop request
 * or we have a defect (unexpected error).
 */
Effect.suspend(() => program).pipe(Effect.provide(PlatformNode.NodeContext.layer), PlatformNode.Runtime.runMain);
