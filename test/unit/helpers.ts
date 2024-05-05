import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as MobyApi from "the-moby-effect/Moby";

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to mess with the host docker install too much.
 */
export const spawnDind = (
    image: ({ kind: "ssh" } | { kind: "http" } | { kind: "https" } | { kind: "socket" }) & { tag: string }
): Effect.Effect<
    [dindContainerId: string, dindVolumeId: string, connectionOptions: MobyApi.MobyConnectionOptions],
    | MobyApi.Containers.ContainersError
    | MobyApi.Images.ImagesError
    | MobyApi.Volumes.VolumesError
    | MobyApi.System.SystemsError,
    MobyApi.Images.Images | MobyApi.Containers.Containers | MobyApi.Volumes.Volumes | Scope.Scope
> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const volumes: MobyApi.Volumes.Volumes = yield* _(MobyApi.Volumes.Volumes);
        const volumeCreateResponse: Readonly<MobyApi.Schemas.Volume> = yield* _(volumes.create({}));

        const containerInspectResponse: Readonly<MobyApi.Schemas.ContainerInspectResponse> = yield* _(
            MobyApi.DockerCommon.run({
                imageOptions: { kind: "pull", fromImage: image.tag },
                containerOptions: {
                    spec: {
                        Image: image.tag,
                        Env: ["DOCKER_TLS_CERTDIR="],
                        Cmd: ["--tls=false"],
                        Volumes: { "/var/lib/docker": {} },
                        HostConfig: {
                            Privileged: true,
                            PortBindings: { "2375/tcp": [{ HostPort: "0" }] },
                            Binds: [`${volumeCreateResponse.Name}:/var/lib/docker`],
                        },
                    },
                },
            })
        );

        const testDindContainerHttpPort = Number.parseInt(
            containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort!
        );

        const testDindContainerHost = containerInspectResponse.NetworkSettings?.Gateway;

        const connectionOptions: MobyApi.MobyConnectionOptions = {
            connection: "http",
            host: testDindContainerHost!,
            port: testDindContainerHttpPort,
        };

        yield* _(
            Effect.provide(
                Effect.retry(
                    Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                    Schedule.recurs(3).pipe(Schedule.addDelay(() => 1000))
                ),
                MobyApi.System.fromConnectionOptions(connectionOptions)
            )
        );

        return [containerInspectResponse.Id!, volumeCreateResponse.Name, connectionOptions] as const;
    });

/** Cleans up the container that will be created in the setup helper. */
export const destroyDind = (containerId: string, volumeName: string) =>
    Effect.gen(function* (_: Effect.Adapter) {
        const containers: MobyApi.Containers.Containers = yield* _(MobyApi.Containers.Containers);
        yield* _(containers.delete({ id: containerId, force: true }));

        const volumes: MobyApi.Volumes.Volumes = yield* _(MobyApi.Volumes.Volumes);
        yield* _(volumes.delete({ name: volumeName, force: true }));
    });
