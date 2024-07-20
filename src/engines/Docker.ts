/**
 * Docker helpers
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as ConfigError from "effect/ConfigError";
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
 * @category Layer
 */
export type DockerLayer = Moby.MobyLayer;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layer: Layer.Layer<
    Layer.Layer.Success<DockerLayer>,
    Layer.Layer.Error<DockerLayer>,
    Layer.Layer.Context<DockerLayer> | HttpClient.HttpClient.Default
> = Moby.layer;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerNodeJS: (connectionOptions: PlatformAgents.MobyConnectionOptions) => DockerLayer = Moby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerBun: (connectionOptions: PlatformAgents.MobyConnectionOptions) => DockerLayer = Moby.layerBun;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerDeno: (connectionOptions: PlatformAgents.MobyConnectionOptions) => DockerLayer = Moby.layerDeno;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerUndici: (connectionOptions: PlatformAgents.MobyConnectionOptions) => DockerLayer = Moby.layerUndici;

/**
 * @since 1.0.0
 * @category Layer
 */
export const layerWeb: (
    connectionOptions: PlatformAgents.MobyConnectionOptions
) => Layer.Layer<
    Layer.Layer.Success<DockerLayer>,
    Layer.Layer.Error<DockerLayer> | ConfigError.ConfigError,
    Layer.Layer.Context<DockerLayer>
> = Moby.layerWeb;

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
    Function.pipe(
        Images.Images,
        Effect.map((images) => images.create({ fromImage: image, "X-Registry-Auth": auth, platform })),
        Stream.unwrap
    );

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
    const release = Function.pipe(
        Images.Images,
        Effect.flatMap((images) => images.delete({ name: image })),
        Effect.orDie
    );
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
}): Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images> =>
    Function.pipe(
        Images.Images,
        Effect.map((images) => images.build({ context, dockerfile, platform, t: tag, "X-Registry-Config": auth })),
        Stream.unwrap
    );

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
}): Effect.Effect<
    Stream.Stream<GeneratedSchemas.JSONMessage, Images.ImagesError, Images.Images>,
    Images.ImagesError,
    Scope.Scope | Images.Images
> => {
    const acquire = build({ tag, auth, context, platform, dockerfile });
    const release = Function.pipe(
        Images.Images,
        Effect.flatMap((images) => images.delete({ name: tag })),
        Effect.orDie
    );
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
        const containers = yield* Containers.Containers;

        const containerCreateResponse = yield* containers.create(containerOptions);
        yield* containers.start({ id: containerCreateResponse.Id });

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning: Effect.Effect<void, Containers.ContainersError, never> = Function.pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
            Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
            Effect.flatMap(({ State }) =>
                Function.pipe(
                    Match.value(State?.Status),
                    Match.when("running", (_s) => Effect.void),
                    Match.when("created", (_s) => Effect.fail("Waiting")),
                    // Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.void),
                    // Match.when(Schemas.ContainerState_Status.CREATED, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is dead or killed"))
                ).pipe(Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", message: s })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: Containers.ContainersError) => message === "Waiting")
                )
            )
        );

        // Helper for if the container has a healthcheck, wait for it to report healthy
        const waitUntilContainerHealthy: Effect.Effect<void, Containers.ContainersError, never> = Function.pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
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
                ).pipe(Effect.mapError((s) => new Containers.ContainersError({ method: "inspect", message: s })))
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
        return yield* containers.inspect({ id: containerCreateResponse.Id });
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
        Effect.gen(function* () {
            const containers = yield* Containers.Containers;
            yield* containers.kill({ id: containerData.Id });
            yield* containers.delete({ id: containerData.Id, force: true });
        }).pipe(Effect.orDie);
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
    ReadonlyArray<GeneratedSchemas.ContainerInspectResponse>,
    Containers.ContainersError,
    Containers.Containers
> => Effect.flatMap(Containers.Containers, (containers) => containers.list(options));

/**
 * Implements the `docker push` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const push = (options: Images.ImagePushOptions): Stream.Stream<string, Images.ImagesError, Images.Images> =>
    Function.pipe(
        Images.Images,
        Effect.map((images) => images.push(options)),
        Stream.unwrap
    );

/**
 * Implements the `docker images` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const images = (
    options?: Images.ImageListOptions | undefined
): Effect.Effect<ReadonlyArray<GeneratedSchemas.ImageSummary>, Images.ImagesError, Images.Images> =>
    Effect.flatMap(Images.Images, (images) => images.list(options));

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search = (
    options: Images.ImageSearchOptions
): Effect.Effect<GeneratedSchemas.RegistrySearchResponse, Images.ImagesError, Images.Images> =>
    Effect.flatMap(Images.Images, (images) => images.search(options));

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
> = Effect.flatMap(System.Systems, (systems) => systems.version());

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
> = Effect.flatMap(System.Systems, (systems) => systems.info());
