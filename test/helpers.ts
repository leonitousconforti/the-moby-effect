import { Effect, Layer, Schedule } from "effect";

import * as MobyApi from "../src/index.js";

/** Connects to the local docker daemon on this host. */
const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

export const BEFORE_ALL_TIMEOUT = 30_000;
export const AFTER_ALL_TIMEOUT = 30_000;

/**
 * This bootstraps the tests by using the api to start a docker-in-docker
 * container on the host so that we have something to test the api against
 * without needing to mess with the host docker install too much.
 */
export const BeforeAll = <
    T extends
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Configs.Configs>)
        | ((
              connectionOptions: MobyApi.MobyConnectionOptions
          ) => Layer.Layer<never, never, MobyApi.Containers.Containers>)
        | ((
              connectionOptions: MobyApi.MobyConnectionOptions
          ) => Layer.Layer<never, never, MobyApi.Distributions.Distributions>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Execs.Execs>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Images.Images>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Networks.Networks>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Nodes.Nodes>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Plugins.Plugins>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Secrets.Secrets>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Services.Services>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Sessions.Sessions>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Swarm.Swarms>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.System.Systems>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Tasks.Tasks>)
        | ((connectionOptions: MobyApi.MobyConnectionOptions) => Layer.Layer<never, never, MobyApi.Volumes.Volumes>),
>(
    dindTag: string,
    forService: T
): Promise<
    Readonly<[dindContainerId: string, testService: ReturnType<T>, connectionOptions: MobyApi.MobyConnectionOptions]>
> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const containerInspectResponse: MobyApi.Schemas.ContainerInspectResponse = yield* _(
            MobyApi.run({
                imageOptions: { kind: "pull", fromImage: `docker.io/library/docker:${dindTag}` },
                containerOptions: {
                    spec: {
                        Image: `docker:${dindTag}`,
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

        const testDindContainerHttpPort = Number.parseInt(
            containerInspectResponse.NetworkSettings?.Ports?.["2375/tcp"]?.[0]?.HostPort!
        );

        const connectionOptions: MobyApi.MobyConnectionOptions = {
            connection: "http",
            host: "localhost",
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

        yield* _(
            Effect.provide(
                Effect.flatMap(MobyApi.Swarm.Swarms, (swarms) => swarms.init({ ListenAddr: "eth0" })),
                MobyApi.Swarm.fromConnectionOptions(connectionOptions)
            )
        );

        const testService = forService(connectionOptions) as ReturnType<T>;
        return [containerInspectResponse.Id!, testService, connectionOptions] as const;
    })
        .pipe(Effect.provide(localDocker))
        .pipe(Effect.runPromise);

/** Cleans up the container that will be created in the setup helper. */
export const AfterAll = (id: string) =>
    MobyApi.Containers.Containers.pipe(Effect.flatMap((containers) => containers.delete({ id, force: true })))
        .pipe(Effect.provide(localDocker))
        .pipe(Effect.runPromise);
