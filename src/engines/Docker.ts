/**
 * Docker engine
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Match from "effect/Match";
import * as ParseResult from "effect/ParseResult";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Moby from "./Moby.js";

import type {
    HttpConnectionOptionsTagged,
    HttpsConnectionOptionsTagged,
    MobyConnectionOptions,
} from "../MobyConnection.js";

import { demuxUnknownToSingleSink } from "../demux/Demux.js";
import { Containers, ContainersError } from "../endpoints/Containers.js";
import { Execs, ExecsError } from "../endpoints/Execs.js";
import { Images, ImagesError } from "../endpoints/Images.js";
import { Systems, SystemsError } from "../endpoints/System.js";
import {
    ContainerInspectResponse,
    ContainerListResponseItem,
    ImageSummary,
    JSONMessage,
    RegistrySearchResponse,
    SystemInfoResponse,
    SystemVersionResponse,
} from "../generated/index.js";

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
export const layerNodeJS: (connectionOptions: MobyConnectionOptions) => DockerLayer = Moby.layerNodeJS;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun: (connectionOptions: MobyConnectionOptions) => DockerLayer = Moby.layerBun;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno: (connectionOptions: MobyConnectionOptions) => DockerLayer = Moby.layerDeno;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici: (connectionOptions: MobyConnectionOptions) => DockerLayer = Moby.layerUndici;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb: (connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged) => DockerLayer =
    Moby.layerWeb;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
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
}): Stream.Stream<JSONMessage, ImagesError, Images> =>
    Stream.unwrap(Images.use((images) => images.create({ fromImage: image, "X-Registry-Auth": auth, platform })));

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
}): Effect.Effect<Stream.Stream<JSONMessage, ImagesError, Images>, never, Images | Scope.Scope> => {
    const acquire = pull({ image, auth, platform });
    const release = Effect.orDie(Images.use((images) => images.delete({ name: image })));
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
}): Stream.Stream<JSONMessage, ImagesError, Images> =>
    Stream.unwrap(
        Images.use((images) =>
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
}): Effect.Effect<Stream.Stream<JSONMessage, ImagesError, Images>, ImagesError, Scope.Scope | Images> => {
    const acquire = build({ tag, buildArgs, auth, context, platform, dockerfile });
    const release = Effect.orDie(Images.use((images) => images.delete({ name: tag })));
    return Effect.acquireRelease(Effect.succeed(acquire), () => release);
};

/**
 * Implements the `docker stop` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const stop = (containerId: string): Effect.Effect<void, ContainersError, Containers> =>
    Containers.use((containers) => containers.stop(containerId));

/**
 * Implements `docker run` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const run = (
    containerOptions: Parameters<Containers["create"]>[0]
): Effect.Effect<ContainerInspectResponse, ContainersError, Containers> =>
    Effect.gen(function* () {
        const containers = yield* Containers;
        const containerCreateResponse = yield* containers.create(containerOptions);
        yield* containers.start(containerCreateResponse.Id);

        // Helper to wait until a container is dead or running
        const waitUntilContainerDeadOrRunning = Function.pipe(
            containers.inspect(containerCreateResponse.Id),
            // Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
            Effect.flatMap(({ State }) =>
                Function.pipe(
                    Match.value(State?.Status),
                    Match.when("running", (_s) => Effect.void),
                    Match.when("created", (_s) => Effect.fail("Waiting")),
                    // Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.void),
                    // Match.when(Schemas.ContainerState_Status.CREATED, (_s) => Effect.fail("Waiting")),
                    Match.orElse((_s) => Effect.fail("Container is dead or killed"))
                ).pipe(Effect.mapError((s) => new ContainersError({ method: "inspect", cause: new Error(s) })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(Schedule.whileInput(({ message }: ContainersError) => message === "Waiting"))
            )
        );

        // Helper for if the container has a healthcheck, wait for it to report healthy
        const waitUntilContainerHealthy = Function.pipe(
            containers.inspect(containerCreateResponse.Id),
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
                ).pipe(Effect.mapError((s) => new ContainersError({ method: "inspect", cause: new Error(s) })))
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(Schedule.whileInput(({ message }: ContainersError) => message === "Waiting"))
            )
        );

        yield* waitUntilContainerDeadOrRunning;
        yield* waitUntilContainerHealthy;
        return yield* containers.inspect(containerCreateResponse.Id);
    });

/**
 * Implements `docker run` command as a scoped effect. When the scope is closed,
 * both the image and the container is removed.
 *
 * @since 1.0.0
 * @category Docker
 */
export const runScoped = (
    containerOptions: Parameters<Containers["create"]>[0]
): Effect.Effect<ContainerInspectResponse, ContainersError, Scope.Scope | Containers> => {
    const acquire = run(containerOptions);
    const release = (containerData: ContainerInspectResponse) =>
        Effect.orDie(
            Effect.gen(function* () {
                const containers = yield* Containers;
                // FIXME: this cleanup should be better
                yield* Effect.catchTag(containers.stop(containerData.Id), "ContainersError", () => Effect.void);
                yield* containers.delete(containerData.Id, { force: true });
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
}): Effect.Effect<void, ExecsError | Socket.SocketError | ParseResult.ParseError, Execs> =>
    Effect.gen(function* () {
        const execs = yield* Execs;
        const execId = yield* execs.container(containerId, {
            Cmd: command,
            AttachStderr: true,
            AttachStdout: true,
            AttachStdin: false,
        });

        return yield* execs.start(execId.Id, { Detach: true });
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
}): Effect.Effect<string, ExecsError | Socket.SocketError | ParseResult.ParseError, Execs> =>
    Effect.gen(function* () {
        const execs = yield* Execs;
        const execId = yield* execs.container(containerId, {
            Cmd: command,
            AttachStderr: true,
            AttachStdout: true,
            AttachStdin: false,
        });

        const socket = yield* execs.start(execId.Id, { Detach: false });

        const input = Stream.never;
        const output = Sink.collectAll<string>();
        return yield* Effect.map(demuxUnknownToSingleSink(socket, input, output), Chunk.join(""));
    }).pipe(Effect.scoped);

/**
 * Implements the `docker ps` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ps = (
    options?: Parameters<Containers["list"]>[0]
): Effect.Effect<ReadonlyArray<ContainerListResponseItem>, ContainersError, Containers> =>
    Containers.use((containers) => containers.list(options));

/**
 * Implements the `docker push` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const push = (options: Parameters<Images["push"]>[0]): Stream.Stream<string, ImagesError, Images> =>
    Stream.unwrap(Images.use((images) => images.push(options)));

/**
 * Implements the `docker images` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const images = (
    options?: Parameters<Images["list"]>[0]
): Effect.Effect<ReadonlyArray<ImageSummary>, ImagesError, Images> => Images.use((images) => images.list(options));

/**
 * Implements the `docker search` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const search = (
    options: Parameters<Images["search"]>[0]
): Effect.Effect<ReadonlyArray<RegistrySearchResponse>, ImagesError, Images> =>
    Images.use((images) => images.search(options));

/**
 * Implements the `docker version` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const version: () => Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, Systems> = Function.constant(
    Systems.use((systems) => systems.version())
);

/**
 * Implements the `docker info` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const info: () => Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, Systems> = Function.constant(
    Systems.use((systems) => systems.info())
);

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const ping: () => Effect.Effect<"OK", SystemsError, Systems> = Function.constant(
    Systems.use((systems) => systems.ping())
);

/**
 * Implements the `docker ping` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const pingHead: () => Effect.Effect<void, SystemsError, Systems> = Function.constant(
    Systems.use((systems) => systems.ping())
);
