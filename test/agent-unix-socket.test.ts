import { Effect } from "effect";

import * as MobyApi from "../src/main.js";

// How long jest has to run the before all and after all hooks.
const WARMUP_TIMEOUT = 30_000;
const COOLDOWN_TIMEOUT = 30_000;

/** Connects to the local docker daemon on this host. */
const [HostsLocalMobyClient, MobyServiceLocal] = MobyApi.makeMobyLayer("hostsLocalMobyClient", {
    protocol: "unix",
    socketPath: "/var/run/docker.sock",
});

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string | undefined;

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
                            HostConfig: {
                                Privileged: true,
                                PortBindings: { "2375/tcp": [{ HostPort: "0" }], "2376": [{ HostPort: "0" }] },
                            },
                        },
                    },
                })
            );

            testDindContainerId = containerInspectResponse.Id!;
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

describe("MobyApi unix socket agent tests", () => {
    it("Local unix socket agent should see at least one container", async () => {
        const testData: readonly MobyApi.ContainerSummary[] = await Effect.runPromise(
            HostsLocalMobyClient.pipe(Effect.flatMap((service) => service.containerList({ all: true })))
                .pipe(Effect.scoped)
                .pipe(Effect.provide(MobyServiceLocal))
        );
        expect(testData).toBeInstanceOf(Array);
        expect(testData.length).toBeGreaterThan(0);
    });
});
