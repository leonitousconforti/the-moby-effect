import path from "node:path";

import * as NodeFs from "@effect/platform-node/FileSystem";
import { Effect, Schedule } from "effect";

import * as MobyApi from "../src/index.js";
import { AFTER_ALL_TIMEOUT, BEFORE_ALL_TIMEOUT } from "./helpers.js";

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testDindContainerHttpsPort: string = undefined!;

/** Where the https certificates of the dind container will be mounted. */
let testDindContainerHttpsCertDirectory: string = undefined!;

/** Connects to the local docker daemon on this host. */
const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to modify the host docker install.
 */
beforeAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const fsService: NodeFs.FileSystem = yield* _(NodeFs.FileSystem);
            testDindContainerHttpsCertDirectory = yield* _(fsService.makeTempDirectory());

            const volumes: MobyApi.Volumes.Volumes = yield* _(MobyApi.Volumes.Volumes);
            const volumeCreateResponse: Readonly<MobyApi.Schemas.Volume> = yield* _(volumes.create({}));

            const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
                MobyApi.run({
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/docker:dind" },
                    containerOptions: {
                        spec: {
                            Image: "docker:dind",
                            Env: ["DOCKER_TLS_CERTDIR=/certs"],
                            Volumes: { "/var/lib/docker": {} },
                            HostConfig: {
                                Privileged: true,
                                PortBindings: { "2375/tcp": [{ HostPort: "0" }], "2376/tcp": [{ HostPort: "0" }] },
                                Binds: [
                                    `${testDindContainerHttpsCertDirectory}:/certs/client`,
                                    `${volumeCreateResponse.Name}:/var/lib/docker`,
                                ],
                            },
                        },
                    },
                })
            );

            dindStorageVolumeName = volumeCreateResponse.Name;
            testDindContainerId = containerInspectResponse.Id!;
            testDindContainerHttpsPort = containerInspectResponse.NetworkSettings?.Ports?.["2376/tcp"]?.[0]?.HostPort!;
        })
            .pipe(Effect.provide(NodeFs.layer))
            .pipe(Effect.provide(localDocker))
            .pipe(Effect.runPromise),
    BEFORE_ALL_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const fsService: NodeFs.FileSystem = yield* _(NodeFs.FileSystem);
            const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);
            const volumes: MobyApi.Volumes.Volumes = yield* _(MobyApi.Volumes.Volumes);
            yield* _(containers.delete({ id: testDindContainerId!, force: true }));
            yield* _(fsService.remove(testDindContainerHttpsCertDirectory!, { recursive: true }));
            yield* _(volumes.delete({ name: dindStorageVolumeName!, force: true }));
        })
            .pipe(Effect.provide(NodeFs.layer))
            .pipe(Effect.provide(localDocker))
            .pipe(Effect.runPromise),
    AFTER_ALL_TIMEOUT
);

describe("MobyApi https agent tests", () => {
    it("http agent should be able to ping docker", async () => {
        const [ca, key, cert] = await Effect.runPromise(
            Effect.retry(
                NodeFs.FileSystem.pipe(
                    Effect.flatMap((service) =>
                        Effect.all([
                            service.readFileString(path.join(testDindContainerHttpsCertDirectory!, "ca.pem")),
                            service.readFileString(path.join(testDindContainerHttpsCertDirectory!, "key.pem")),
                            service.readFileString(path.join(testDindContainerHttpsCertDirectory!, "cert.pem")),
                        ])
                    )
                ).pipe(Effect.provide(NodeFs.layer)),
                Schedule.recurs(5).pipe(Schedule.addDelay(() => 1000))
            )
        );

        const message: string = await Effect.runPromise(
            Effect.provide(
                Effect.retry(
                    Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                    Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
                ),
                MobyApi.System.fromConnectionOptions({
                    ca,
                    key,
                    cert,
                    connection: "https",
                    host: "localhost",
                    port: Number.parseInt(testDindContainerHttpsPort!),
                })
            )
        );
        expect(message).toBe("OK");
    }, 10_000);
});
