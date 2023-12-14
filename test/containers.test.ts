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

describe("MobyApi Containers tests", () => {
    it("Should create, pause, unpause, top, kill, start, restart, stop, rename, changes, prune, and finally force delete a container (this test could be flaky because it pulls the alpine image from docker hub)", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            // Download the image from docker hub if necessary, create the container, start it, wait for it to be running
            const { Id: containerId } = yield* _(
                testDockerClient.run({
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/alpine:latest" },
                    containerOptions: { body: { Image: "docker.io/library/alpine:latest", Cmd: ["sleep", "1m"] } },
                })
            );

            // Pause and unpause the container
            yield* _(testDockerClient.containerPause({ id: containerId }));
            yield* _(testDockerClient.containerUnpause({ id: containerId }));

            // Top, stats one-shot, and stats stream the container
            yield* _(testDockerClient.containerTop({ id: containerId }));
            yield* _(testDockerClient.containerStats({ id: containerId, stream: false }));
            const statsStream = yield* _(testDockerClient.containerStats({ id: containerId, stream: true }));
            yield* _(statsStream.pipe(Stream.take(1)).pipe(Stream.runCollect));

            // Update and resize the container
            yield* _(testDockerClient.containerUpdate({ id: containerId, spec: { Devices: [] } }));
            yield* _(testDockerClient.containerResize({ id: containerId, h: 100, w: 100 }));

            // Kill, start, restart, and stop the container
            yield* _(testDockerClient.containerKill({ id: containerId }));
            yield* _(testDockerClient.containerStart({ id: containerId }));
            yield* _(testDockerClient.containerRestart({ id: containerId }));
            yield* _(testDockerClient.containerStop({ id: containerId }));

            // Get the FS changes, get details about a path, and get a tarball for a path
            yield* _(testDockerClient.containerChanges({ id: containerId }));
            yield* _(testDockerClient.containerArchiveInfo({ id: containerId, path: "/bin" }));
            const archiveStream = yield* _(testDockerClient.containerArchive({ id: containerId, path: "/bin" }));
            yield* _(testDockerClient.putContainerArchive({ id: containerId, path: "/bin", stream: archiveStream }));

            // Export the container
            const exportStream = yield* _(testDockerClient.containerExport({ id: containerId }));
            yield* _(Stream.runCollect(exportStream));

            // Rename, force delete, and prune the container
            yield* _(testDockerClient.containerRename({ id: containerId, name: "new-name" }));
            yield* _(testDockerClient.containerDelete({ id: containerId, force: true }));
            yield* _(testDockerClient.containerPrune());
        })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    }, 60_000);

    it("Should wait for a container to exit", async () => {
        await Effect.gen(function* (_: Effect.Adapter) {
            const { Id: containerId } = yield* _(
                testDockerClient.run({
                    imageOptions: { kind: "pull", fromImage: "docker.io/library/alpine:latest" },
                    containerOptions: { body: { Image: "docker.io/library/alpine:latest", Cmd: ["sleep", "1s"] } },
                })
            );

            yield* _(testDockerClient.containerWait({ id: containerId }));
            yield* _(testDockerClient.containerLogs({ id: containerId, follow: false, stdout: true, stderr: true }));
        })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);
    }, 10_000);
});
