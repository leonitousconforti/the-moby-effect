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

            testDindContainerId = containerInspectResponse.Id;
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

describe("MobyApi Configs tests", () => {
    it("Should see no configs", async () => {
        const configs = await testDockerClient.configList().pipe(Effect.scoped).pipe(Effect.runPromise);
        expect(configs).toHaveLength(0);
    });

    it("Should create a config", async () => {
        const configCreateResponse: Readonly<MobyApi.IDResponse> = await testDockerClient
            .configCreate({
                Name: "testConfig",
                Data: Buffer.from("aaahhhhh").toString("base64"),
                Labels: { testLabel: "test" },
            })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(configCreateResponse.ID).toBeDefined();
    });

    it("Should see one config", async () => {
        const configs: readonly MobyApi.Config[] = await testDockerClient
            .configList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);
    });

    it("Should update a config", async () => {
        const configs: readonly MobyApi.Config[] = await testDockerClient
            .configList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);

        const id: string = configs[0]!.ID;
        const configInspectResponse: Readonly<MobyApi.Config> = await testDockerClient
            .configInspect({ id })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(configInspectResponse).toBeDefined();
        expect(configInspectResponse.Spec).toBeDefined();
        expect(configInspectResponse.Spec?.Labels).toBeDefined();
        expect(configInspectResponse.Spec?.Labels?.["testLabel"]).toBe("test");

        await testDockerClient
            .configUpdate({
                id,
                version: configInspectResponse.Version.Index,
                spec: { ...configInspectResponse.Spec, Labels: { testLabel: "test2" } },
            })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    });

    it("Should see no configs with label testLabel=test", async () => {
        const configs: readonly MobyApi.Config[] = await testDockerClient
            .configList({ filters: JSON.stringify({ label: ["testLabel=test"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(0);
    });

    it("Should delete a config", async () => {
        const configs: readonly MobyApi.Config[] = await testDockerClient
            .configList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);

        const id: string = configs[0]!.ID;
        await testDockerClient.configDelete({ id }).pipe(Effect.scoped).pipe(Effect.runPromise);
    });

    it("Should see no configs", async () => {
        const configs = await testDockerClient.configList().pipe(Effect.scoped).pipe(Effect.runPromise);
        expect(configs).toHaveLength(0);
    });
});
