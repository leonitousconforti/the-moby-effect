import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as url from "node:url";
import * as tar from "tar-fs";

import * as MobyApi from "the-moby-effect/Moby";
import * as Containers from "the-moby-effect/endpoints/Containers";
import * as Images from "the-moby-effect/endpoints/Images";
import * as System from "the-moby-effect/endpoints/System";
import * as Volumes from "the-moby-effect/endpoints/Volumes";

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to mess with the host docker install too much.
 */
export const spawnDind = (
    image: ({ kind: "ssh" } | { kind: "http" } | { kind: "https" } | { kind: "socket" }) & { tag: string }
): Effect.Effect<
    [dindContainerId: string, dindVolumeId: string, connectionOptions: MobyApi.MobyConnectionOptions],
    Containers.ContainersError | Images.ImagesError | Volumes.VolumesError | System.SystemsError,
    Images.Images | Containers.Containers | Volumes.Volumes | Scope.Scope
> =>
    Effect.gen(function* () {
        const volumes = yield* Volumes.Volumes;
        const volumeCreateResponse = yield* volumes.create({});

        const containerInspectResponse = yield* MobyApi.DockerCommon.run({
            imageOptions: {
                kind: "build",
                t: "the-moby-effect-dind-testing-image:latest",
                buildargs: JSON.stringify({ DIND_IMAGE: image.tag }),
                dockerfile: `agent-${image.kind}.dockerfile`,
                context: Stream.fromAsyncIterable(
                    tar.pack(url.fileURLToPath(new URL("./data", import.meta.url)), {
                        entries: [`agent-${image.kind}.dockerfile`],
                    }),
                    () =>
                        new MobyApi.Images.ImagesError({
                            method: "buildStream",
                            message: "error packing the build context",
                        })
                ),
            },
            containerOptions: {
                spec: {
                    Image: "the-moby-effect-dind-testing-image:latest",
                    Env: ["DOCKER_TLS_CERTDIR="],
                    Cmd: ["--tls=false"],
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
        });

        const testDindContainerHttpPort = Number.parseInt(
            containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort!
        );

        const testDindContainerHost = containerInspectResponse.NetworkSettings?.Gateway;

        const connectionOptions: MobyApi.MobyConnectionOptions = {
            connection: "http",
            host: testDindContainerHost!,
            port: testDindContainerHttpPort,
        };

        yield* Effect.provide(
            Effect.retry(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
            ),
            MobyApi.System.fromConnectionOptions(connectionOptions)
        );

        return [containerInspectResponse.Id!, volumeCreateResponse.Name, connectionOptions] as const;
    });

/** Cleans up the container that will be created in the setup helper. */
export const destroyDind = (
    containerId: string,
    volumeName: string
): Effect.Effect<void, Containers.ContainersError | Volumes.VolumesError, Containers.Containers | Volumes.Volumes> =>
    Effect.gen(function* () {
        const containers: Containers.ContainersImpl = yield* Containers.Containers;
        yield* containers.delete({ id: containerId, force: true });

        const volumes: Volumes.VolumesImpl = yield* Volumes.Volumes;
        yield* volumes.delete({ name: volumeName, force: true });
    });
