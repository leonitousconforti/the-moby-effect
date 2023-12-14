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

/** Not tested: VolumeUpdate because it only applies to Swarm cluster volumes. */
describe("MobyApi Volumes tests", () => {
    it("Should see no volumes", async () => {
        const testData: Readonly<MobyApi.VolumeListResponse> = await testDockerClient
            .volumeList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should create a volume", async () => {
        const testData: Readonly<MobyApi.Volume> = await testDockerClient
            .volumeCreate({ Name: "testVolume" })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Name).toBe("testVolume");
        expect(testData.CreatedAt).toBeDefined();
        expect(new Date(testData.CreatedAt!).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it("Should see one volume", async () => {
        const testData: Readonly<MobyApi.VolumeListResponse> = await testDockerClient
            .volumeList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(1);
    });

    it("Should inspect the volume", async () => {
        const testData: Readonly<MobyApi.Volume> = await testDockerClient
            .volumeInspect({ name: "testVolume" })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Name).toBe("testVolume");
        expect(testData.Driver).toBe("local");
        expect(testData.Mountpoint).toBe("/var/lib/docker/volumes/testVolume/_data");
        expect(testData.Labels).toBeNull();
        expect(testData.Scope).toBe(MobyApi.Volume_ScopeEnum.Local);
        expect(testData.Options).toBeNull();
    });

    it("Should remove the volume", async () => {
        await testDockerClient.volumeDelete({ name: "testVolume" }).pipe(Effect.scoped).pipe(Effect.runPromise);
    });

    it("Should see no volumes", async () => {
        const testData: Readonly<MobyApi.VolumeListResponse> = await testDockerClient
            .volumeList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should create a volume with labels", async () => {
        const testData: Readonly<MobyApi.Volume> = await testDockerClient
            .volumeCreate({ Name: "testVolume", Labels: { testLabel: "test" } })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Name).toBe("testVolume");
        expect(testData.CreatedAt).toBeDefined();
        expect(new Date(testData.CreatedAt!).getTime()).toBeLessThanOrEqual(Date.now());
        expect(testData.Labels).toEqual({ testLabel: "test" });
    });

    it("Should list volumes with labels", async () => {
        const testData: Readonly<MobyApi.VolumeListResponse> = await testDockerClient
            .volumeList({ filters: JSON.stringify({ label: ["testLabel=test"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(1);
    });

    it("Should list non dangling volumes", async () => {
        const testData: Readonly<MobyApi.VolumeListResponse> = await testDockerClient
            .volumeList({ filters: JSON.stringify({ dangling: ["false"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });

    it("Should prune volumes", async () => {
        const testData: Readonly<MobyApi.VolumePruneResponse> = await testDockerClient
            .volumePrune({ filters: JSON.stringify({ all: ["true"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.SpaceReclaimed).toBe(0);
        expect(testData.VolumesDeleted).toBeInstanceOf(Array);
        expect(testData.VolumesDeleted).toHaveLength(1);
        expect(testData.VolumesDeleted![0]).toBe("testVolume");
    });

    it("Should see no volumes", async () => {
        const testData: Readonly<MobyApi.VolumeListResponse> = await testDockerClient
            .volumeList()
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData.Warnings).toBeNull();
        expect(testData.Volumes).toBeInstanceOf(Array);
        expect(testData.Volumes).toHaveLength(0);
    });
});
