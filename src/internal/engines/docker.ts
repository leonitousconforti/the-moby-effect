/**
 * Docker engine
 *
 * @since 1.0.0
 */

import * as Socket from "@effect/platform/Socket";
import * as Array from "effect/Array";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Global from "effect/GlobalValue";
import * as Match from "effect/Match";
import * as MutableHashMap from "effect/MutableHashMap";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";
import * as Moby from "./moby.js";

import type {
    HttpConnectionOptionsTagged,
    HttpsConnectionOptionsTagged,
    MobyConnectionOptions,
} from "../platforms/connection.js";

import { demuxUnknownToSingleSink } from "../demux/demux.js";
import {
    demuxMultiplexedSocket,
    makeMultiplexedStreamChannel,
    MultiplexedStreamChannel,
    MultiplexedStreamSocket,
} from "../demux/multiplexed.js";
import { pack } from "../demux/pack.js";
import { demuxRawSocket, RawStreamSocket } from "../demux/raw.js";
import { Containers, ContainersError } from "../endpoints/containers.js";
import { Execs, ExecsError } from "../endpoints/execs.js";
import { Images, ImagesError } from "../endpoints/images.js";
import { Systems, SystemsError } from "../endpoints/system.js";
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
export type DockerLayerWithoutHttpClientOrWebsocketConstructor = Moby.MobyLayerWithoutHttpClientOrWebsocketConstructor;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWithoutHttpCLient: DockerLayerWithoutHttpClientOrWebsocketConstructor = Moby.layerWithoutHttpCLient;

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
export const layerFetch: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => DockerLayer = Moby.layerFetch;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic: (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
) => DockerLayerWithoutHttpClientOrWebsocketConstructor = Moby.layerAgnostic;

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
}): Effect.Effect<Stream.Stream<JSONMessage, ImagesError, never>, never, Images | Scope.Scope> =>
    Effect.Do.pipe(
        Effect.bind("images", () => Images),
        Effect.let("stream", () => pull({ image, auth, platform })),
        Effect.let("acquire", ({ images, stream }) => Stream.provideService(stream, Images, images)),
        Effect.let("release", ({ images }) => images.delete({ name: image })),
        Effect.flatMap(({ acquire, release }) =>
            Effect.acquireRelease(
                Effect.sync(() => acquire),
                () => Effect.orDie(release)
            )
        )
    );

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
}): Effect.Effect<Stream.Stream<JSONMessage, ImagesError, never>, never, Scope.Scope | Images> =>
    Effect.Do.pipe(
        Effect.bind("images", () => Images),
        Effect.let("stream", () => build({ tag, buildArgs, auth, context, platform, dockerfile })),
        Effect.let("acquire", ({ images, stream }) => Stream.provideService(stream, Images, images)),
        Effect.let("release", ({ images }) => images.delete({ name: tag })),
        Effect.flatMap(({ acquire, release }) =>
            Effect.acquireRelease(
                Effect.sync(() => acquire),
                () => Effect.orDie(release)
            )
        )
    );

/**
 * Implements the `docker start` command.
 *
 * @since 1.0.0
 * @category Docker
 */
export const start = (containerId: string): Effect.Effect<void, ContainersError, Containers> =>
    Containers.use((containers) => containers.start(containerId));

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
 * Implements the `docker exec` command in a non blocking fashion. Incompatible
 * with web when not detached.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execNonBlocking = <T extends boolean | undefined = undefined>({
    command,
    containerId,
    detach,
}: {
    detach?: T;
    containerId: string;
    command: string | Array<string>;
}): Effect.Effect<
    [socket: T extends true ? void : RawStreamSocket | MultiplexedStreamSocket, execId: string],
    ExecsError,
    Execs
> =>
    Effect.gen(function* () {
        const execs = yield* Execs;
        const execId = yield* execs.container(containerId, {
            AttachStdin: true,
            AttachStderr: true,
            AttachStdout: true,
            Cmd: Predicate.isString(command) ? command.split(" ") : command,
        });

        const socket = yield* execs.start<T>(execId.Id, { Detach: detach as T });
        return Tuple.make(socket, execId.Id);
    });

/**
 * Implements the `docker exec` command in a blocking fashion. Incompatible with
 * web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const exec = ({
    command,
    containerId,
}: {
    containerId: string;
    command: string | Array<string>;
}): Effect.Effect<
    readonly [exitCode: number, output: string],
    ExecsError | Socket.SocketError | ParseResult.ParseError,
    Execs
> =>
    Effect.gen(function* () {
        const [socket, execId] = yield* execNonBlocking({ command, containerId, detach: false });
        const output = yield* demuxUnknownToSingleSink(socket, Stream.never, Sink.mkString);
        const execInspectResponse = yield* Execs.use((execs) => execs.inspect(execId));
        if (execInspectResponse.Running === true) {
            return yield* new ExecsError({ method: "exec", cause: new Error("Exec is still running") });
        } else {
            return Tuple.make(execInspectResponse.ExitCode, output);
        }
    });

/** @internal */
const execWebsocketsRegistry = Global.globalValue("the-moby-effect/engines/docker/execWebsocketsRegistry", () =>
    MutableHashMap.empty<string, Effect.Semaphore>()
);

/** @internal */
const validShellEntrypoints = Global.globalValue(
    "the-moby-effect/engines/docker/execWebsocketsValidShellEntrypoints",
    () =>
        new Set([
            "/bin/sh", // Basic shell available in most containers
            "/bin/bash", // Bash shell (common in many Linux distributions)
            "/usr/bin/bash", // Alternative location for bash
            "/bin/dash", // Debian Almquist shell (lightweight shell)
            "/bin/ash", // Lightweight shell used in Alpine Linux
            "/bin/zsh", // Z shell
            "/usr/bin/zsh", // Alternative location for zsh
            "/bin/ksh", // Korn shell
            "/bin/tcsh", // TENEX C shell
            "/bin/csh", // C shell
            "/usr/bin/fish", // Friendly interactive shell
            "/usr/local/bin/bash", // Alternative location for bash
            "/usr/local/bin/sh", // Alternative location for sh
            "/busybox/sh", // Busybox shell
        ])
);

/**
 * Implements the `docker exec` command in a non blocking fashion with
 * websockets as the underlying transport instead of the docker engine exec apis
 * so that is can be compatible with web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execWebsocketsNonBlocking = ({
    command,
    containerId,
}: {
    command: string | Array<string>;
    containerId: string;
}): Effect.Effect<MultiplexedStreamChannel<never, Socket.SocketError | ContainersError>, never, Containers> =>
    Effect.gen(function* () {
        const containers = yield* Containers;

        const mutex = MutableHashMap.get(execWebsocketsRegistry, containerId).pipe(
            Option.getOrElse(() => {
                const semaphore = Effect.unsafeMakeSemaphore(1);
                MutableHashMap.set(execWebsocketsRegistry, containerId, semaphore);
                return semaphore;
            })
        );

        const acquire = Effect.gen(function* () {
            const inspect = yield* containers.inspect(containerId);
            const command = Array.join(inspect.Config?.Cmd ?? [], " ");
            const entrypoint = Array.join(inspect.Config?.Entrypoint ?? [], " ");
            if (!validShellEntrypoints.has(command) && !validShellEntrypoints.has(entrypoint)) {
                return yield* new ContainersError({
                    method: "exec",
                    cause: new Error(
                        `The underlying container must have a shell entrypoint/command in order to use execWebsocket, your containers command was: ${command} and entrypoint is: ${entrypoint} neither of which are valid shell entrypoints`
                    ),
                });
            }
            yield* mutex.take(1);
            return yield* Effect.void;
        });

        const release = Effect.fnUntraced(function* () {
            const containers = yield* Containers;
            yield* mutex.release(1);
            yield* containers.wait(containerId, { condition: "not-running" });
            yield* containers.start(containerId);
        }, Effect.orDie);

        const use = Effect.gen(function* () {
            const containers = yield* Containers;
            const cmd = Predicate.isString(command) ? command : Array.join(command, " ");
            const input = Stream.concat(Stream.succeed(`${cmd}; exit\n`), Stream.make(new Socket.CloseEvent()));
            const stdinSocket = yield* containers.attachWebsocket(containerId, { stdin: true, stream: true });
            const stdoutSocket = yield* containers.attachWebsocket(containerId, { stdout: true, stream: true });
            const stderrSocket = yield* containers.attachWebsocket(containerId, { stderr: true, stream: true });
            const multiplexedSocket = yield* pack({ stdin: stdinSocket, stdout: stdoutSocket, stderr: stderrSocket });
            const producer = Channel.fromEffect(demuxRawSocket(stdinSocket, input, Sink.drain));
            const consumer = multiplexedSocket.underlying;
            const zipped = Channel.zipLeft(consumer, producer);
            return zipped;
        });

        const multiplexedChannel = Effect.acquireRelease(acquire, release)
            .pipe(Effect.map(() => Channel.unwrap(use)))
            .pipe(Channel.unwrapScoped)
            .pipe(Channel.provideService(Containers, containers));

        return makeMultiplexedStreamChannel(multiplexedChannel);
    });

/**
 * Implements the `docker exec` command in a blocking fashion with websockets as
 * the underlying transport instead of the docker engine exec apis so that is
 * can be compatible with web.
 *
 * @since 1.0.0
 * @category Docker
 */
export const execWebsockets = ({
    command,
    containerId,
}: {
    command: string | Array<string>;
    containerId: string;
}): Effect.Effect<
    readonly [stdout: string, stderr: string],
    ContainersError | Socket.SocketError | ParseResult.ParseError,
    Containers
> =>
    Function.pipe(
        execWebsocketsNonBlocking({ command, containerId }),
        Effect.flatMap(demuxMultiplexedSocket(Stream.empty, Sink.mkString, Sink.mkString))
    );

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
