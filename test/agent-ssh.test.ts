import url from "node:url";
import tar from "tar-fs";

import { Effect, Schedule, Stream } from "effect";

import * as MobyApi from "../src/index.js";
import { COOLDOWN_TIMEOUT, WARMUP_TIMEOUT } from "./helpers.js";

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string = undefined!;
let testDindContainerSshPort: string = undefined!;
const testSshDindImageTag: string = "ssh-dind:latest";

/** Connects to the local docker daemon on this host. */
const localConnectionOptions: MobyApi.MobyConnectionOptions = {
    connection: "unix",
    socketPath: "/var/run/docker.sock",
};

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to modify the host docker install.
 */
beforeAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
                MobyApi.run({
                    imageOptions: {
                        kind: "build",
                        t: testSshDindImageTag,
                        stream: Stream.orDie(
                            Stream.fromAsyncIterable(
                                tar.pack(url.fileURLToPath(new URL("../../test", import.meta.url)), {
                                    entries: ["agent-ssh.dockerfile"],
                                }),
                                () =>
                                    new MobyApi.Images.ImagesError({
                                        method: "buildStream",
                                        message: "error packing the build context",
                                    })
                            )
                        ),
                        dockerfile: "agent-ssh.dockerfile",
                    },
                    containerOptions: {
                        spec: {
                            Image: testSshDindImageTag,
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
            .pipe(Effect.provide(MobyApi.Images.fromConnectionOptions(localConnectionOptions)))
            .pipe(Effect.provide(MobyApi.Containers.fromConnectionOptions(localConnectionOptions)))
            .pipe(Effect.runPromise),
    WARMUP_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(
    async () =>
        MobyApi.Containers.Containers.pipe(
            Effect.flatMap((containers) => containers.delete({ id: testDindContainerId, force: true }))
        )
            .pipe(Effect.provide(MobyApi.Containers.fromConnectionOptions(localConnectionOptions)))
            .pipe(Effect.runPromise),
    COOLDOWN_TIMEOUT
);

describe("MobyApi ssh agent tests", () => {
    it("ssh agent should be able to ping docker", async () => {
        const message: string = await Effect.runPromise(
            Effect.provide(
                Effect.retry(
                    Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                    Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
                ),
                MobyApi.System.fromConnectionOptions({
                    connection: "ssh",
                    host: "localhost",
                    port: Number.parseInt(testDindContainerSshPort!),
                    username: "root",
                    password: "password",
                    remoteSocketPath: "/var/run/docker.sock",
                })
            )
        );
        expect(message).toBe("OK");
    });
});
