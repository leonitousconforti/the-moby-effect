import { Effect, Schedule, Stream } from "effect";
import url from "node:url";
import tar from "tar-fs";

import * as MobyApi from "../src/main.js";

// How long jest has to run the before all and after all hooks.
const WARMUP_TIMEOUT = 30_000;
const COOLDOWN_TIMEOUT = 30_000;

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string | undefined;
let testDindContainerSshPort: string | undefined;
const testDindContainerName: string = "ssh-dind:latest";

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
            const containerInspectResponse: MobyApi.ContainerInspectResponse = yield* _(
                localDocker.run({
                    imageOptions: {
                        kind: "build",
                        t: testDindContainerName,
                        body: Stream.fromAsyncIterable(
                            tar.pack(url.fileURLToPath(new URL("../../test", import.meta.url)), {
                                entries: ["agent-ssh.dockerfile"],
                            }),
                            () => new MobyApi.ImageBuildError({ message: "error packing the build context" })
                        ),
                        dockerfile: "agent-ssh.dockerfile",
                    },
                    containerOptions: {
                        body: {
                            Image: testDindContainerName,
                            HostConfig: {
                                Privileged: true,
                                PortBindings: {
                                    "22/tcp": [{ HostPort: "0" }],
                                    "2375/tcp": [{ HostPort: "0" }],
                                    "2376/tcp": [{ HostPort: "0" }],
                                },
                            },
                        },
                    },
                })
            );

            testDindContainerId = containerInspectResponse.Id!;
            testDindContainerSshPort = containerInspectResponse.NetworkSettings?.Ports?.["22/tcp"]?.[0]?.HostPort!;
        })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise),
    WARMUP_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(
    async () =>
        await localDocker
            .containerDelete({ id: testDindContainerId!, force: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise),
    COOLDOWN_TIMEOUT
);

describe("MobyApi ssh agent tests", () => {
    it("ssh agent should connect but see no containers", async () => {
        const dindSshMobyClient = MobyApi.makeMobyClient({
            protocol: "ssh",
            host: "localhost",
            port: Number.parseInt(testDindContainerSshPort!),
            username: "root",
            password: "password",
            socketPath: "/var/run/docker.sock",
        });

        await Effect.runPromise(
            Effect.retry(
                dindSshMobyClient.systemPing().pipe(Effect.scoped),
                Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
            )
        );

        const testData: readonly MobyApi.ContainerSummary[] = await dindSshMobyClient
            .containerList({ all: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData).toBeInstanceOf(Array);
        expect(testData.length).toBe(0);
    });
});
