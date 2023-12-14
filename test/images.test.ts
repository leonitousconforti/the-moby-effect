import { Effect, Schedule, Stream } from "effect";

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

describe("MobyApi Images tests", () => {
    it("Should see no images", async () => {
        const images: Readonly<MobyApi.ImageSummary[]> = await testDockerClient
            .imageList({ all: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(images).toHaveLength(0);
    });

    it("Should search for an image (this test could be flaky depending on docker hub availability and transient network conditions)", async () => {
        const searchResults: Readonly<MobyApi.ImageSearchResponseItem[]> = await testDockerClient
            .imageSearch({ term: "alpine", limit: 1, filters: JSON.stringify({ "is-official": ["true"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(searchResults).toBeInstanceOf(Array);
        expect(searchResults).toHaveLength(1);
        expect(searchResults[0]!.name).toBe("alpine");
        expect(searchResults[0]!.is_official).toBe(true);
        expect(searchResults[0]!.is_automated).toBe(false);
        expect(searchResults[0]!.description).toBe(
            "A minimal Docker image based on Alpine Linux with a complete package index and only 5 MB in size!"
        );
    });

    it("Should pull an image", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const pullResponse: Stream.Stream<never, MobyApi.MobyError, string> = yield* _(
                testDockerClient.imageCreate({
                    fromImage: "docker.io/library/alpine:latest",
                })
            );

            yield* _(Stream.runCollect(pullResponse));
        })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    }, 30_000);

    it("Should inspect an image", async () => {
        const inspectResponse: Readonly<MobyApi.ImageInspect> = await testDockerClient
            .imageInspect({ name: "docker.io/library/alpine:latest" })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(inspectResponse.Id).toBeDefined();
        expect(inspectResponse.RepoDigests).toBeDefined();
        expect(inspectResponse.RepoTags).toBeDefined();
        expect(inspectResponse.Size).toBeDefined();
        expect(inspectResponse.VirtualSize).toBeDefined();
    });

    it("Should tag an image", async () => {
        await testDockerClient
            .imageTag({
                name: "docker.io/library/alpine:latest",
                repo: "docker.io/person/their-image",
                tag: "test",
            })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    });

    it("Should get the history of an image", async () => {
        const historyResponse: Readonly<MobyApi.HistoryResponseItem[]> = await testDockerClient
            .imageHistory({ name: "docker.io/library/alpine:latest" })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(historyResponse).toBeInstanceOf(Array);
    });

    it("Should prune all images", async () => {
        const pruneResponse: Readonly<MobyApi.ImagePruneResponse> = await testDockerClient
            .imagePrune({ filters: JSON.stringify({ dangling: ["true"] }) })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(pruneResponse.ImagesDeleted).toBeDefined();
        expect(pruneResponse.SpaceReclaimed).toBeDefined();
    });
});
