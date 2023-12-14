import { Effect, Schedule } from "effect";

import * as MobyApi from "../src/main.js";

// How long jest has to run the before all and after all hooks.
const WARMUP_TIMEOUT = 30_000;
const COOLDOWN_TIMEOUT = 30_000;

/** Connects to the local docker daemon on this host. */
const localDockerClient: MobyApi.IMobyService = MobyApi.makeMobyClient();

/** The client we are going to use to test. */
let testDockerClient: MobyApi.IMobyService = undefined!;

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string | undefined;

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to modify the host docker install.
 */
beforeAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const containerInspectResponse: MobyApi.ContainerInspectResponse = yield* _(
                localDockerClient.run({
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
            const testDindContainerHttpPort = Number.parseInt(
                containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort!
            );

            testDockerClient = MobyApi.makeMobyClient({
                protocol: "http",
                host: "localhost",
                port: testDindContainerHttpPort,
            });

            yield* _(
                Effect.retry(
                    testDockerClient.systemPing().pipe(Effect.scoped),
                    Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
                )
            );
        })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise),
    WARMUP_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(
    async () =>
        await localDockerClient
            .containerDelete({ id: testDindContainerId!, force: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise),
    COOLDOWN_TIMEOUT
);

/** TODO: Figure out how to test Swarm. */
describe("MobyApi Swarm tests", () => {
    it("Should do something", async () => {
        const testData: readonly MobyApi.ContainerSummary[] = await testDockerClient
            .containerList({ all: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData).toBeInstanceOf(Array);
        expect(testData.length).toBe(0);
    });
});
