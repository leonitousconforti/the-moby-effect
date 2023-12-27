import url from "node:url";
import tar from "tar-fs";

import { Effect, Schedule, Stream } from "effect";

import * as MobyApi from "../src/index.js";
import { AFTER_ALL_TIMEOUT, AfterAll, BEFORE_ALL_TIMEOUT } from "./helpers.js";

/** The ID of the dind docker container we can test against on the host. */
let testDindContainerId: string = undefined!;
let dindStorageVolumeName: string = undefined!;
let testDindContainerSshPort: string = undefined!;
const testSshDindImageTag: string = "ssh-dind:latest";

/** Connects to the local docker daemon on this host. */
const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to modify the host docker install.
 */
beforeAll(
    async () =>
        await Effect.gen(function* (_: Effect.Adapter) {
            const volumes: MobyApi.Volumes.Volumes = yield* _(MobyApi.Volumes.Volumes);
            const volumeCreateResponse: Readonly<MobyApi.Schemas.Volume> = yield* _(volumes.create({}));

            const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
                MobyApi.run({
                    imageOptions: {
                        kind: "build",
                        t: testSshDindImageTag,
                        // FIXME: I really dislike have to do stream.orDie here
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
                            Volumes: { "/var/lib/docker": {} },
                            HostConfig: {
                                Privileged: true,
                                PortBindings: {
                                    "22/tcp": [{ HostPort: "0" }],
                                    "2375/tcp": [{ HostPort: "0" }],
                                    "2376/tcp": [{ HostPort: "0" }],
                                },
                                Binds: [`${volumeCreateResponse.Name}:/var/lib/docker`],
                            },
                        },
                    },
                })
            );

            dindStorageVolumeName = volumeCreateResponse.Name;
            testDindContainerId = containerInspectResponse.Id!;
            testDindContainerSshPort = containerInspectResponse.NetworkSettings?.Ports?.["22/tcp"]?.[0]?.HostPort!;
        })
            .pipe(Effect.provide(localDocker))
            .pipe(Effect.runPromise),
    BEFORE_ALL_TIMEOUT
);

/** Cleans up the container that will be created in the setup helper. */
afterAll(async () => await AfterAll(testDindContainerId, dindStorageVolumeName), AFTER_ALL_TIMEOUT);

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
