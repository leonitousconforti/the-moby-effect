/**
 * Docker engine helpers
 *
 * @since 1.0.0
 */

import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import * as PlatformAgents from "../PlatformAgents.js";
import * as Containers from "../endpoints/Containers.js";
import * as Images from "../endpoints/Images.js";
import * as System from "../endpoints/System.js";
import * as GeneratedSchemas from "../generated/index.js";
import * as Moby from "./Moby.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayerWithoutPlatformLayerConstructor = Moby.MobyLayerWithoutPlatformLayerConstructor;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayerWithoutHttpClient = Moby.MobyLayerWithoutHttpClient;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayer<E1 = never> = Layer.Layer<
    Layer.Layer.Success<DockerLayerWithoutPlatformLayerConstructor> | DockerLayerConstructor,
    Layer.Layer.Error<DockerLayerWithoutPlatformLayerConstructor> | E1,
    Layer.Layer.Context<DockerLayerWithoutPlatformLayerConstructor>
>;

/**
 * @since 1.0.0
 * @category Tags
 */
export interface DockerLayerConstructor {
    readonly _: unique symbol;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export type DockerLayerConstructorImpl<E1 = never> = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
) => DockerLayer<E1>;

/**
 * @since 1.0.0
 * @category Tags
 */
export const PlatformLayerConstructor = <E1 = never>(): Context.Tag<
    DockerLayerConstructor,
    DockerLayerConstructorImpl<E1>
> =>
    Context.GenericTag<DockerLayerConstructor, DockerLayerConstructorImpl<E1>>(
        "@the-moby-effect/engines/Docker/PlatformLayerConstructor"
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: DockerLayerWithoutHttpClient = Moby.layerWithoutHttpCLient;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: DockerLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): DockerLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerNodeJS,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerNodeJS))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: DockerLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): DockerLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerBun,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerBun))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: DockerLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): DockerLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerDeno,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerDeno))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: DockerLayerConstructorImpl = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): DockerLayer =>
    Function.pipe(
        connectionOptions,
        Moby.layerUndici,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor())),
        Layer.map(Context.add(PlatformLayerConstructor(), layerUndici))
    );

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: DockerLayerConstructorImpl<ConfigError.ConfigError> = (
    connectionOptions: PlatformAgents.MobyConnectionOptions
): DockerLayer<ConfigError.ConfigError> =>
    Function.pipe(
        connectionOptions,
        Moby.layerWeb,
        Layer.map(Context.omit(Moby.PlatformLayerConstructor<ConfigError.ConfigError>())),
        Layer.map(Context.add(PlatformLayerConstructor<ConfigError.ConfigError>(), layerWeb))
    );

/**
 * Implements the `docker pull` command. It does not have all the flags that the
 * images create endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pull = ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}): Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images> =>
    Stream.unwrap(Images.Images.create({ fromImage: image, "X-Registry-Auth": auth, platform }));

/**
 * Implements the `docker pull` command as a scoped effect. When the scope is
 * closed, the pulled image is removed. It doesn't have all the flags that the
 * images create endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pullScoped = ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}): Effect.Effect<
    Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>,
    never,
    Images.Images | Scope.Scope
> => {
    const acquire = pull({ image, auth, platform });
    const release = Effect.orDie(Images.Images.delete({ name: image }));
    return Effect.acquireRelease(Effect.succeed(acquire), () => release);
};

/**
 * Implements the `docker build` command. It doesn't have all the flags that the
 * images build endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const build = <E1>({
    auth,
    buildArgs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    auth?: string | undefined;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
    buildArgs?: Record<string, string | undefined> | undefined;
}): Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images> =>
    Stream.unwrap(Images.Images.build({ context, buildArgs, dockerfile, platform, t: tag, "X-Registry-Config": auth }));

/**
 * Implements the `docker build` command as a scoped effect. When the scope is
 * closed, the built image is removed. It doesn't have all the flags that the
 * images build endpoint exposes.
 *
 * @since 1.0.0
 * @category Docker
 */
export const buildScoped = <E1>({
    auth,
    buildArgs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    auth?: string | undefined;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    buildArgs?: Record<string, string | undefined> | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
}): Effect.Effect<
    Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>,
    Images.ImagesError,
    Scope.Scope | Images.Images
> => {
    const acquire = build({ tag, buildArgs, auth, context, platform, dockerfile });
    const release = Effect.orDie(Images.Images.delete({ name: tag }));
    return Effect.acquireRelease(Effect.succeed(acquire), () => release);
};

/**
 * Implements `docker run` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const run = (
    containerOptions: Containers.ContainerCreateOptions
): Effect.Effect<GeneratedSchemas.ContainerInspectResponse, Containers.ContainersError, Containers.Containers> =>
    Effect.gen(function* () {
        const containerCreateResponse = yield* Containers.Containers.create(containerOptions);
        yield* Containers.Containers.start({ id: containerCreateResponse.Id });

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning = Function.pipe(
            Containers.Containers.inspect({ id: containerCreateResponse.Id }),
            Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
            Effect.flatMap(({ State }) =>
                Function.pipe(
                    Match.value(State?.Status),
                    Match.when("running", (_s) => Effect.void),
                    Match.when("created", (_s) => Effect.fail("Waiting")),
                    // Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.void),
                    // Match.when(Schemas.ContainerState_Status.CREATED, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is dead or killed"))
                ).pipe(
                    Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", cause: new Error(s) }))
                )
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
                )
            )
        );

        // Helper for if the container has a healthcheck, wait for it to report healthy
        const waitUntilContainerHealthy = Function.pipe(
            Containers.Containers.inspect({ id: containerCreateResponse.Id }),
            Effect.tap(({ State }) =>
                Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
            ),
            Effect.flatMap(({ State }) =>
                Function.pipe(
                    Match.value(State?.Health?.Status),
                    Match.when(undefined, (_s) => Effect.void),
                    Match.when("healthy", (_s) => Effect.void),
                    Match.when("starting", (_s) => Effect.fail("Waiting")),
                    // Match.when(Schemas.Health_Status.HEALTHY, (_s) => Effect.void),
                    // Match.when(Schemas.Health_Status.STARTING, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is unhealthy"))
                ).pipe(
                    Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", cause: new Error(s) }))
                )
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
                )
            )
        );

        yield* waitUntilContainerDeadOrRunning;
        yield* waitUntilContainerHealthy;
        return yield* Containers.Containers.inspect({ id: containerCreateResponse.Id });
    });

/**
 * Implements `docker run` command as a scoped effect. When the scope is closed,
 * both the image and the container is removed.
 *
 * @since 1.0.0
 * @category Docker
 */
export const runScoped = (
    containerOptions: Containers.ContainerCreateOptions
): Effect.Effect<
    GeneratedSchemas.ContainerInspectResponse,
    Containers.ContainersError,
    Scope.Scope | Containers.Containers
> => {
    const acquire = run(containerOptions);
    const release = (containerData: GeneratedSchemas.ContainerInspectResponse) =>
        Effect.orDie(
            Effect.gen(function* () {
                const containers = yield* Containers.Containers;
                yield* containers.kill({ id: containerData.Id });
                yield* containers.delete({ id: containerData.Id, force: true });
            })
        );
    return Effect.acquireRelease(acquire, release);
};

/**
 * Implements `docker exec` command.
 *
 * @since 1.0.0
 * @category Docker
 */
// export const exec = <T extends boolean | undefined>(
//     options1: Execs.ContainerExecOptions,
//     options2: Omit<Schema.Schema.Encoded<typeof Schemas.ExecStartConfig>, "Detach"> & { Detach?: T }
// ) =>
//     Effect.gen(function* () {
//         const execs: Execs.Execs = yield* Execs.Execs;
//         const execCreateResponse: Schemas.IdResponse = yield* execs.container(options1);
//         return yield* execs.start<T>({ id: execCreateResponse.Id, execStartConfig: options2 });
//     });

/**
 * Implements the `docker ps` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ps = (
    options?: Containers.ContainerListOptions | undefined
): Effect.Effect<
    ReadonlyArray<GeneratedSchemas.ContainerListResponseItem>,
    Containers.ContainersError,
    Containers.Containers
> => Containers.Containers.list(options);

/**
 * Implements the `docker push` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const push = (options: Images.ImagePushOptions): Stream.Stream<string, Images.ImagesError, Images.Images> =>
    Stream.unwrap(Images.Images.push(options));

/**
 * Implements the `docker images` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const images = (
    options?: Images.ImageListOptions | undefined
): Effect.Effect<ReadonlyArray<GeneratedSchemas.ImageSummary>, Images.ImagesError, Images.Images> =>
    Images.Images.list(options);

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search = (
    options: Images.ImageSearchOptions
): Effect.Effect<GeneratedSchemas.RegistrySearchResponse, Images.ImagesError, Images.Images> =>
    Images.Images.search(options);

/**
 * Implements the `docker version` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const version: Effect.Effect<
    Readonly<GeneratedSchemas.SystemVersionResponse>,
    System.SystemsError,
    System.Systems
> = System.Systems.version();

/**
 * Implements the `docker info` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const info: Effect.Effect<
    Readonly<GeneratedSchemas.SystemInfoResponse>,
    System.SystemsError,
    System.Systems
> = System.Systems.info();
