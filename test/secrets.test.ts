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

            yield* _(testDockerClient.swarmInit({ ListenAddr: "eth0" }));
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

describe("MobyApi Secrets tests", () => {
    it("Should see no secrets", async () => {
        const secrets: Readonly<MobyApi.Secret[]> = await testDockerClient
            .secretList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(secrets).toBeInstanceOf(Array);
        expect(secrets).toHaveLength(0);
    });

    it("Should create a secret", async () => {
        const secret: Readonly<MobyApi.IDResponse> = await testDockerClient
            .secretCreate({
                Name: "test-secret",
                Labels: { testLabel: "test" },
                Data: Buffer.from("aaahhhhh").toString("base64"),
            })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(secret.ID).toBeDefined();
    });

    it("Should list and inspect the secret", async () => {
        const secrets: Readonly<MobyApi.Secret[]> = await testDockerClient
            .secretList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(secrets).toEqual([
            {
                ID: expect.any(String),
                Version: { Index: expect.any(Number) },
                CreatedAt: expect.any(String),
                UpdatedAt: expect.any(String),
                Spec: { Name: "test-secret", Labels: { testLabel: "test" } },
            },
        ]);

        const secret: Readonly<MobyApi.Secret> = await testDockerClient
            .secretInspect({ id: secrets[0]!.ID! })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(secret).toEqual(secrets[0]);
    });

    it("Should update the secret", async () => {
        const secrets: Readonly<MobyApi.Secret[]> = await testDockerClient
            .secretList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        await testDockerClient
            .secretUpdate({
                id: secrets[0]!.ID,
                version: secrets[0]!.Version.Index,
                spec: { ...secrets[0]!.Spec, Labels: { testLabelUpdated: "test" } },
            })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    });

    it("Should list secrets with the new label", async () => {
        const secrets: Readonly<MobyApi.Secret[]> = await testDockerClient
            .secretList({ filters: JSON.stringify({ label: ["testLabelUpdated=test"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(secrets).toBeInstanceOf(Array);
        expect(secrets).toHaveLength(1);
    });

    it("Should delete the secret", async () => {
        const secrets = await testDockerClient.secretList().pipe(Effect.scoped).pipe(Effect.runPromise);
        await testDockerClient.secretDelete({ id: secrets[0]!.ID! }).pipe(Effect.scoped).pipe(Effect.runPromise);

        const secretsAfterDelete = await testDockerClient.secretList().pipe(Effect.scoped).pipe(Effect.runPromise);
        expect(secretsAfterDelete).toEqual([]);
    });
});
