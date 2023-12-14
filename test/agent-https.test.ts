import path from "node:path";

import * as NodeFs from "@effect/platform-node/FileSystem";
import { Effect, Schedule } from "effect";

import * as MobyApi from "../src/main.js";

// How long jest has to run the before all and after all hooks.
const WARMUP_TIMEOUT = 30_000;
const COOLDOWN_TIMEOUT = 30_000;

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string | undefined;
let testDindContainerHttpsPort: string | undefined;

/** Where the https certificates of the dind container will be mounted. */
let testDindContainerHttpsCertDirectory: string | undefined;

/** Connects to the local docker daemon on this host. */
const localDocker: MobyApi.IMobyService = MobyApi.makeMobyClient();

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
            const containerInspectResponse: MobyApi.ContainerInspectResponse = yield* _(
                localDocker.run({
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/docker:dind" },
                    containerOptions: {
                        body: {
                            Image: "docker:dind",
                            Env: ["DOCKER_TLS_CERTDIR=/certs"],
                            HostConfig: {
                                Privileged: true,
                                Binds: [`${testDindContainerHttpsCertDirectory}:/certs/client`],
                                PortBindings: { "2375/tcp": [{ HostPort: "0" }], "2376/tcp": [{ HostPort: "0" }] },
                            },
                        },
                    },
                })
            );

            testDindContainerId = containerInspectResponse.Id!;
            testDindContainerHttpsPort = containerInspectResponse.NetworkSettings?.Ports?.["2376/tcp"]?.[0]?.HostPort!;
        })
            .pipe(Effect.scoped)
            .pipe(Effect.provide(NodeFs.layer))
            .pipe(Effect.runPromise),
    WARMUP_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const fsService: NodeFs.FileSystem = yield* _(NodeFs.FileSystem);
            yield* _(localDocker.containerDelete({ id: testDindContainerId!, force: true }));
            yield* _(fsService.remove(testDindContainerHttpsCertDirectory!, { recursive: true }));
        })
            .pipe(Effect.scoped)
            .pipe(Effect.provide(NodeFs.layer))
            .pipe(Effect.runPromise),
    COOLDOWN_TIMEOUT
);

describe("MobyApi https agent tests", () => {
    it("https agent should connect but see no containers", async () => {
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

        const dindHttpsMobyClient = MobyApi.makeMobyClient({
            ca,
            key,
            cert,
            protocol: "https",
            host: "localhost",
            port: Number.parseInt(testDindContainerHttpsPort!),
        });

        await Effect.runPromise(
            Effect.retry(
                dindHttpsMobyClient.systemPing().pipe(Effect.scoped),
                Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
            )
        );

        const testData: readonly MobyApi.ContainerSummary[] = await dindHttpsMobyClient
            .containerList({ all: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData).toBeInstanceOf(Array);
        expect(testData.length).toBe(0);
    }, 10_000);
});
