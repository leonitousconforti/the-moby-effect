import { Effect, Schedule } from "effect";

import * as MobyApi from "../src/main.js";

// How long jest has to run the before all and after all hooks.
const WARMUP_TIMEOUT = 30_000;
const COOLDOWN_TIMEOUT = 30_000;

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string | undefined;
let testDindContainerHttpPort: string | undefined;

/** Connects to the local docker daemon on this host. */
const [HostsLocalMobyClient, MobyServiceLocal] = MobyApi.makeMobyLayer("hostsLocalMobyClient");

/**
 * This bootstraps the tests by using the generated api to start a
 * docker-in-docker container on the host so that we have something to test the
 * generated api against without needing to modify the host docker install.
 */
beforeAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const localService: MobyApi.IMobyService = yield* _(HostsLocalMobyClient);

            const containerInspectResponse: MobyApi.ContainerInspectResponse = yield* _(
                localService.run({
                    mobyClient: HostsLocalMobyClient,
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/docker:dind" },
                    containerOptions: {
                        body: {
                            Image: "docker:dind",
                            Env: ["DOCKER_TLS_CERTDIR="],
                            Cmd: ["--tls=false"],
                            HostConfig: {
                                Privileged: true,
                                PortBindings: { "2375/tcp": [{ HostPort: "0" }], "2376/tcp": [{ HostPort: "0" }] },
                            },
                        },
                    },
                })
            );

            testDindContainerId = containerInspectResponse.Id!;
            testDindContainerHttpPort = containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort!;
        })
            .pipe(Effect.provide(MobyServiceLocal))
            .pipe(Effect.runPromise),
    WARMUP_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const localService: MobyApi.IMobyService = yield* _(HostsLocalMobyClient);
            yield* _(localService.containerDelete({ id: testDindContainerId!, force: true }));
        })
            .pipe(Effect.scoped)
            .pipe(Effect.provide(MobyServiceLocal))
            .pipe(Effect.runPromise),
    COOLDOWN_TIMEOUT
);

describe("MobyApi http agent tests", () => {
    it("http agent should connect but see no containers", async () => {
        const [DindHttpMobyClient, MobyServiceHttpDind] = MobyApi.makeMobyLayer("dindHttpMobyClient", {
            protocol: "http",
            host: "localhost",
            port: Number.parseInt(testDindContainerHttpPort!),
        });

        await Effect.runPromise(
            Effect.retry(
                DindHttpMobyClient.pipe(Effect.flatMap((service) => service.systemPing()))
                    .pipe(Effect.scoped)
                    .pipe(Effect.provide(MobyServiceHttpDind)),
                Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
            )
        );

        const testData: readonly MobyApi.ContainerSummary[] = await Effect.runPromise(
            DindHttpMobyClient.pipe(Effect.flatMap((service) => service.containerList({ all: true })))
                .pipe(Effect.scoped)
                .pipe(Effect.provide(MobyServiceHttpDind))
        );

        expect(testData).toBeInstanceOf(Array);
        expect(testData.length).toBe(0);
    });
});
