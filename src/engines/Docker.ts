/**
 * Docker engine
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";

import * as Containers from "../endpoints/Containers.js";
import * as Execs from "../endpoints/Execs.js";
import * as Images from "../endpoints/Images.js";
import * as System from "../endpoints/System.js";
import * as GeneratedSchemas from "../generated/index.js";
import * as Platforms from "../MobyConnection.js";
import * as Demux from "../MobyDemux.js";
import * as Moby from "./Moby.js";

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayer = Moby.MobyLayer;

/**
 * @since 1.0.0
 * @category Layers
 */
export type DockerLayerWithoutHttpClient = Moby.MobyLayerWithoutHttpClient;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: DockerLayerWithoutHttpClient = Moby.layerWithoutHttpCLient;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS: (connectionOptions: Platforms.MobyConnectionOptions) => DockerLayer = Moby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: Platforms.MobyConnectionOptions) => DockerLayer = Moby.layerBun;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: Platforms.MobyConnectionOptions) => DockerLayer = Moby.layerDeno;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: Platforms.MobyConnectionOptions) => DockerLayer = Moby.layerUndici;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (
    connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
) => DockerLayer = Moby.layerWeb;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: Platforms.HttpConnectionOptionsTagged | Platforms.HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClient = Moby.layerAgnostic;

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
    Stream.unwrap(
        Images.Images.use((images) => images.create({ fromImage: image, "X-Registry-Auth": auth, platform }))
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
    const release = Effect.orDie(Images.Images.use((images) => images.delete({ name: image })));
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
    Stream.unwrap(
        Images.Images.use((images) =>
            images.build({ context, buildArgs, dockerfile, platform, t: tag, "X-Registry-Config": auth })
        )
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
    const release = Effect.orDie(Images.Images.use((images) => images.delete({ name: tag })));
    return Effect.acquireRelease(Effect.succeed(acquire), () => release);
};

/**
 * Implements the `docker stop` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const stop = (containerId: string): Effect.Effect<void, Containers.ContainersError, Containers.Containers> =>
    Containers.Containers.use((containers) => containers.stop({ id: containerId }));

/**
 * Implements `docker run` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const run = (
    containerOptions: Parameters<Containers.Containers["create"]>[0]
): Effect.Effect<GeneratedSchemas.ContainerInspectResponse, Containers.ContainersError, Containers.Containers> =>
    Effect.gen(function* () {
        const containers = yield* Containers.Containers;
        const containerCreateResponse = yield* containers.create(containerOptions);
        yield* containers.start({ id: containerCreateResponse.Id });

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning = Function.pipe(
            containers.inspect({ id: containerCreateResponse.Id }),
            // Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
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
            containers.inspect({ id: containerCreateResponse.Id }),
            // Effect.tap(({ State }) =>
            //     Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
            // ),
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
    containerOptions: Parameters<Containers.Containers["create"]>[0]
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
                // FIXME: this cleanup should be better
                yield* Effect.catchTag(containers.stop({ id: containerData.Id }), "ContainersError", () => Effect.void);
                yield* containers.delete({ id: containerData.Id, force: true });
            })
        );
    return Effect.acquireRelease(acquire, release);
};

/**
 * Implements the `docker exec` command in a non blocking fashion.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execNonBlocking = ({
    command,
    containerId,
}: {
    containerId: string;
    command: Array<string>;
}): Effect.Effect<void, Execs.ExecsError | Socket.SocketError | ParseResult.ParseError, Execs.Execs> =>
    Effect.gen(function* () {
        const execs = yield* Execs.Execs;
        const execId = yield* execs.container({
            id: containerId,
            execConfig: {
                Cmd: command,
                AttachStderr: true,
                AttachStdout: true,
                AttachStdin: false,
            },
        });

        return yield* execs.start({
            id: execId.Id,
            execStartConfig: { Detach: true },
        });
    }).pipe(Effect.scoped);

/**
 * Implements the `docker exec` command in a blocking fashion.
 *
 * @since 1.0.0
 * @category Docker
 */
export const exec = ({
    command,
    containerId,
}: {
    containerId: string;
    command: Array<string>;
}): Effect.Effect<string, Execs.ExecsError | Socket.SocketError | ParseResult.ParseError, Execs.Execs> =>
    Effect.gen(function* () {
        const execs = yield* Execs.Execs;
        const execId = yield* execs.container({
            id: containerId,
            execConfig: {
                Cmd: command,
                AttachStderr: true,
                AttachStdout: true,
                AttachStdin: false,
            },
        });

        const socket = yield* execs.start({
            id: execId.Id,
            execStartConfig: { Detach: false },
        });

        const input = Stream.never;
        const output = Sink.collectAll<string>();
        return yield* Effect.map(Demux.demuxUnknownToSingleSink(socket, input, output), Chunk.join(""));
    }).pipe(Effect.scoped);

/**
 * Implements the `docker ps` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ps = (
    options?: Parameters<Containers.Containers["list"]>[0]
): Effect.Effect<
    ReadonlyArray<GeneratedSchemas.ContainerListResponseItem>,
    Containers.ContainersError,
    Containers.Containers
> => Containers.Containers.use((containers) => containers.list(options));

/**
 * Implements the `docker push` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const push = (
    options: Parameters<Images.Images["push"]>[0]
): Stream.Stream<string, Images.ImagesError, Images.Images> =>
    Stream.unwrap(Images.Images.use((images) => images.push(options)));

/**
 * Implements the `docker images` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const images = (
    options?: Parameters<Images.Images["list"]>[0]
): Effect.Effect<ReadonlyArray<GeneratedSchemas.ImageSummary>, Images.ImagesError, Images.Images> =>
    Images.Images.use((images) => images.list(options));

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search = (
    options: Parameters<Images.Images["search"]>[0]
): Effect.Effect<ReadonlyArray<GeneratedSchemas.RegistrySearchResponse>, Images.ImagesError, Images.Images> =>
    Images.Images.use((images) => images.search(options));

/**
 * Implements the `docker version` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const version: () => Effect.Effect<
    Readonly<GeneratedSchemas.SystemVersionResponse>,
    System.SystemsError,
    System.Systems
> = Function.constant(System.Systems.use((systems) => systems.version()));

/**
 * Implements the `docker info` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const info: () => Effect.Effect<
    Readonly<GeneratedSchemas.SystemInfoResponse>,
    System.SystemsError,
    System.Systems
> = Function.constant(System.Systems.use((systems) => systems.info()));

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ping: () => Effect.Effect<"OK", System.SystemsError, System.Systems> = Function.constant(
    System.Systems.use((systems) => systems.ping())
);

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pingHead: () => Effect.Effect<void, System.SystemsError, System.Systems> = Function.constant(
    System.Systems.use((systems) => systems.ping())
);
