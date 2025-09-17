import type * as HttpApiError from "@effect/platform/HttpApiError";
import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Socket from "@effect/platform/Socket";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as MobySchemas from "../../MobySchemas.js";
import type * as IdSchemas from "../schemas/id.js";

import * as Array from "effect/Array";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Global from "effect/GlobalValue";
import * as MutableHashMap from "effect/MutableHashMap";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";
import * as MobyDemux from "../../MobyDemux.js";
import * as MobyEndpoints from "../../MobyEndpoints.js";

/** @internal */
export const pull = ({
    image,
    platform,
}: {
    image: string;
    platform?: string | undefined;
}): Stream.Stream<
    MobySchemas.JSONMessage,
    | HttpApiError.NotFound
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.Images
> => Stream.unwrap(MobyEndpoints.Images.use((images) => images.create({ fromImage: image, platform })));

/** @internal */
export const pullScoped = ({
    image,
    platform,
}: {
    image: string;
    platform?: string | undefined;
}): Effect.Effect<
    Stream.Stream<
        MobySchemas.JSONMessage,
        | HttpApiError.NotFound
        | HttpApiError.InternalServerError
        | HttpApiError.HttpApiDecodeError
        | HttpClientError.HttpClientError
        | ParseResult.ParseError,
        never
    >,
    never,
    MobyEndpoints.Images | Scope.Scope
> =>
    Effect.Do.pipe(
        Effect.bind("images", () => MobyEndpoints.Images),
        Effect.let("stream", () => pull({ image, platform })),
        Effect.let("acquire", ({ images, stream }) => Stream.provideService(stream, MobyEndpoints.Images, images)),
        Effect.let("release", ({ images }) => images.delete(image)),
        Effect.flatMap(({ acquire, release }) =>
            Effect.acquireRelease(
                Effect.sync(() => acquire),
                () => Effect.orDie(release)
            )
        )
    );

/** @internal */
export const build = <E1>({
    buildargs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
    buildargs?: Record<string, string | undefined> | undefined;
}): Stream.Stream<
    MobySchemas.JSONMessage,
    | HttpApiError.BadRequest
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.Images
> =>
    Stream.unwrap(
        MobyEndpoints.Images.use((images) => images.build(context, { buildargs, dockerfile, platform, t: tag }))
    );

/** @internal */
export const buildScoped = <E1>({
    buildargs,
    context,
    dockerfile,
    platform,
    tag,
}: {
    tag: string;
    platform?: string | undefined;
    dockerfile?: string | undefined;
    buildargs?: Record<string, string | undefined> | undefined;
    context: Stream.Stream<Uint8Array, E1, never>;
}): Effect.Effect<
    Stream.Stream<
        MobySchemas.JSONMessage,
        | HttpApiError.BadRequest
        | HttpApiError.InternalServerError
        | HttpApiError.HttpApiDecodeError
        | HttpClientError.HttpClientError
        | ParseResult.ParseError,
        never
    >,
    never,
    Scope.Scope | MobyEndpoints.Images
> =>
    Effect.Do.pipe(
        Effect.bind("images", () => MobyEndpoints.Images),
        Effect.let("stream", () => build({ tag, buildargs, context, platform, dockerfile })),
        Effect.let("acquire", ({ images, stream }) => Stream.provideService(stream, MobyEndpoints.Images, images)),
        Effect.let("release", ({ images }) => images.delete(tag)),
        Effect.flatMap(({ acquire, release }) =>
            Effect.acquireRelease(
                Effect.sync(() => acquire),
                () => Effect.orDie(release)
            )
        )
    );

/** @internal */
export const start = (
    containerId: IdSchemas.ContainerId
): Effect.Effect<
    void,
    | HttpApiError.NotFound
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.Containers
> => MobyEndpoints.Containers.use((containers) => containers.start(containerId));

/** @internal */
export const stop = (
    containerId: IdSchemas.ContainerId
): Effect.Effect<
    void,
    | HttpApiError.NotFound
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.Containers
> => MobyEndpoints.Containers.use((containers) => containers.stop(containerId));

/** @internal */
export const run = (
    name: string,
    platform: string,
    container: MobySchemas.ContainerCreateRequest
): Effect.Effect<
    MobySchemas.ContainerInspectResponse,
    | HttpApiError.BadRequest
    | HttpApiError.Forbidden
    | HttpApiError.NotFound
    | HttpApiError.NotAcceptable
    | HttpApiError.Conflict
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.Containers
> =>
    Effect.gen(function* () {
        const containers = yield* MobyEndpoints.Containers;
        const containerCreateResponse = yield* containers.create(name, platform, container);
        yield* containers.start(containerCreateResponse.Id as IdSchemas.ContainerId);

        // // Helper to wait until a container is dead or running
        // const waitUntilContainerDeadOrRunning = Function.pipe(
        //     containers.inspect(containerCreateResponse.Id),
        //     // Effect.tap(({ State }) => Effect.log(`Waiting for container to be running, state=${State?.Status}`)),
        //     Effect.flatMap(({ State }) =>
        //         Function.pipe(
        //             Match.value(State?.Status),
        //             Match.when("running", (_s) => Effect.void),
        //             Match.when("created", (_s) => Effect.fail("Waiting")),
        //             // Match.when(Schemas.ContainerState_Status.RUNNING, (_s) => Effect.void),
        //             // Match.when(Schemas.ContainerState_Status.CREATED, (_s) => Effect.fail("Waiting")),
        //             Match.orElse((_s) => Effect.fail("Container is dead or killed"))
        //         ).pipe(
        //             Effect.mapError(
        //                 (s) => new MobyEndpoints.ContainersError({ method: "inspect", cause: new Error(s) })
        //             )
        //         )
        //     )
        // ).pipe(
        //     Effect.retry(
        //         Schedule.spaced(500).pipe(
        //             Schedule.whileInput(({ message }: MobyEndpoints.ContainersError) => message === "Waiting")
        //         )
        //     )
        // );

        // // Helper for if the container has a healthcheck, wait for it to report healthy
        // const waitUntilContainerHealthy = Function.pipe(
        //     containers.inspect(containerCreateResponse.Id),
        //     // Effect.tap(({ State }) =>
        //     //     Effect.log(`Waiting for container to be healthy, health=${State?.Health?.Status}`)
        //     // ),
        //     Effect.flatMap(({ State }) =>
        //         Function.pipe(
        //             Match.value(State?.Health?.Status),
        //             Match.when(undefined, (_s) => Effect.void),
        //             Match.when("healthy", (_s) => Effect.void),
        //             Match.when("starting", (_s) => Effect.fail("Waiting")),
        //             // Match.when(Schemas.Health_Status.HEALTHY, (_s) => Effect.void),
        //             // Match.when(Schemas.Health_Status.STARTING, (_s) => Effect.fail("Waiting")),
        //             Match.orElse((_s) => Effect.fail("Container is unhealthy"))
        //         ).pipe(
        //             Effect.mapError(
        //                 (s) => new MobyEndpoints.ContainersError({ method: "inspect", cause: new Error(s) })
        //             )
        //         )
        //     )
        // ).pipe(
        //     Effect.retry(
        //         Schedule.spaced(500).pipe(
        //             Schedule.whileInput(({ message }: MobyEndpoints.ContainersError) => message === "Waiting")
        //         )
        //     )
        // );

        // yield* waitUntilContainerDeadOrRunning;
        // yield* waitUntilContainerHealthy;
        return yield* containers.inspect(containerCreateResponse.Id as IdSchemas.ContainerId);
    });

/** @internal */
export const runScoped = (
    name: string,
    platform: string,
    container: MobySchemas.ContainerCreateRequest
): Effect.Effect<
    MobySchemas.ContainerInspectResponse,
    | HttpApiError.BadRequest
    | HttpApiError.Forbidden
    | HttpApiError.NotFound
    | HttpApiError.NotAcceptable
    | HttpApiError.Conflict
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    Scope.Scope | MobyEndpoints.Containers
> => {
    const acquire = run(name, platform, container);
    const release = (containerData: MobySchemas.ContainerInspectResponse) =>
        Effect.orDie(
            MobyEndpoints.Containers.use((containers) =>
                containers.delete(containerData.Id as IdSchemas.ContainerId, { force: true })
            )
        );
    return Effect.acquireRelease(acquire, release);
};

/** @internal */
export const execNonBlocking = <T extends boolean | undefined = undefined>({
    command,
    containerId,
    detach,
}: {
    detach?: T;
    containerId: IdSchemas.ContainerId;
    command: string | Array<string>;
}) =>
    Effect.gen(function* () {
        const execs = yield* MobyEndpoints.Execs;
        const execId = yield* execs.container(containerId, {
            AttachStdin: true,
            AttachStderr: true,
            AttachStdout: true,
            Cmd: Predicate.isString(command) ? command.split(" ") : command,
        });

        const socket = yield* execs.start(execId.Id, { Detach: detach as T });
        return Tuple.make(socket, execId.Id);
    });

/** @internal */
export const exec = ({
    command,
    containerId,
}: {
    containerId: IdSchemas.ContainerId;
    command: string | Array<string>;
}): Effect.Effect<
    readonly [exitCode: number, output: string],
    MobyEndpoints.ExecsError | Socket.SocketError | ParseResult.ParseError,
    MobyEndpoints.Execs
> =>
    Effect.gen(function* () {
        const [socket, execId] = yield* execNonBlocking({ command, containerId, detach: false });
        const output = yield* MobyDemux.demuxToSingleSink(socket, Stream.never, Sink.mkString);
        const execInspectResponse = yield* MobyEndpoints.Execs.use((execs) => execs.inspect(execId));
        if (execInspectResponse.Running === true) {
            return yield* new MobyEndpoints.ExecsError({ method: "exec", cause: new Error("Exec is still running") });
        } else {
            return Tuple.make(execInspectResponse.ExitCode, output);
        }
    });

/** @internal */
const execWebsocketsRegistry = Global.globalValue("the-moby-effect/engines/docker/execWebsocketsRegistry", () =>
    MutableHashMap.empty<string, Effect.Semaphore>()
);

/** @internal */
export const execWebsocketsNonBlocking = ({
    command,
    containerId,
    cwd,
}: {
    command: string | Array<string>;
    cwd?: string | undefined;
    containerId: IdSchemas.ContainerId;
}): Effect.Effect<
    MobyDemux.MultiplexedChannel<never, Socket.SocketError | MobyEndpoints.ContainersError, never>,
    never,
    MobyEndpoints.Containers
> =>
    Effect.gen(function* () {
        const containers = yield* MobyEndpoints.Containers;

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
            yield* Effect.mapError(
                Schema.decodeUnknown(
                    Schema.Literal(
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
                        "/busybox/sh" // Busybox shell
                    )
                )(command),
                (cause) => new MobyEndpoints.ContainersError({ method: "exec", cause })
            );
            yield* mutex.take(1);
        });

        // TODO: should this be un-interuptible?
        const release = Effect.fnUntraced(function* () {
            yield* mutex.release(1);
            yield* containers.wait(containerId, { condition: "not-running" });
            yield* containers.start(containerId);
        }, Effect.orDie);

        const use = Effect.gen(function* () {
            const cmd = Predicate.isString(command) ? command : Array.join(command, " ");
            const cwdCommand = Predicate.isUndefined(cwd) ? cmd : `cd ${cwd} && ${cmd}`;
            const input = Stream.succeed(`${cwdCommand}; exit\n`);
            const stdinSocket = yield* containers.attachWebsocket(containerId, { stdin: true, stream: true });
            const stdoutSocket = yield* containers.attachWebsocket(containerId, { stdout: true, stream: true });
            const stderrSocket = yield* containers.attachWebsocket(containerId, { stderr: true, stream: true });
            const sockets = { stdin: stdinSocket, stdout: stdoutSocket, stderr: stderrSocket } as const;
            const multiplexedSocket = yield* MobyDemux.pack(sockets, { requestedCapacity: 16 });
            const producer = Channel.fromEffect(MobyDemux.demuxRawToSingleSink(stdinSocket, input, Sink.drain));
            const consumer = multiplexedSocket.underlying;
            const zipped = Channel.zipLeft(producer, consumer, { concurrent: true });
            return zipped;
        });

        const multiplexedChannel = Effect.acquireRelease(acquire, release)
            .pipe(Effect.map(() => Channel.unwrap(use)))
            .pipe(Channel.unwrapScoped)
            .pipe(Channel.provideService(MobyEndpoints.Containers, containers));

        return MobyDemux.makeMultiplexedChannel(multiplexedChannel);
    });

/** @internal */
export const execWebsockets = ({
    command,
    containerId,
}: {
    command: string | Array<string>;
    containerId: IdSchemas.ContainerId;
}): Effect.Effect<
    readonly [stdout: string, stderr: string],
    MobyEndpoints.ContainersError | Socket.SocketError | ParseResult.ParseError,
    MobyEndpoints.Containers
> =>
    Function.pipe(
        execWebsocketsNonBlocking({ command, containerId }),
        Effect.flatMap(MobyDemux.demuxMultiplexedToSeparateSinks(Stream.empty, Sink.mkString, Sink.mkString))
    );

/** @internal */
export const ps = (
    options?: Parameters<MobyEndpoints.Containers["list"]>[0]
): Effect.Effect<
    ReadonlyArray<MobySchemas.ContainerListResponseItem>,
    MobyEndpoints.ContainersError,
    MobyEndpoints.Containers
> => MobyEndpoints.Containers.use((containers) => containers.list(options));

/** @internal */
export const push = (
    options: Parameters<MobyEndpoints.Images["push"]>[0]
): Stream.Stream<string, MobyEndpoints.ImagesError, MobyEndpoints.Images> =>
    Stream.unwrap(MobyEndpoints.Images.use((images) => images.push(options)));

/** @internal */
export const images = (
    options?: Parameters<MobyEndpoints.Images["list"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, MobyEndpoints.ImagesError, MobyEndpoints.Images> =>
    MobyEndpoints.Images.use((images) => images.list(options));

/** @internal */
export const search = (
    options: Parameters<MobyEndpoints.Images["search"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResponse>, MobyEndpoints.ImagesError, MobyEndpoints.Images> =>
    MobyEndpoints.Images.use((images) => images.search(options));

/** @internal */
export const version: () => Effect.Effect<
    MobySchemas.SystemVersionResponse,
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.System
> = Function.constant(MobyEndpoints.System.use((systems) => systems.version()));

/** @internal */
export const info: () => Effect.Effect<
    MobySchemas.SystemInfoResponse,
    | ParseResult.ParseError
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError,
    MobyEndpoints.System
> = Function.constant(MobyEndpoints.System.use((systems) => systems.info()));

/** @internal */
export const ping: () => Effect.Effect<
    void,
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.System
> = Function.constant(MobyEndpoints.System.use((systems) => systems.ping()));

/** @internal */
export const pingHead: () => Effect.Effect<
    void,
    | HttpApiError.InternalServerError
    | HttpApiError.HttpApiDecodeError
    | HttpClientError.HttpClientError
    | ParseResult.ParseError,
    MobyEndpoints.System
> = Function.constant(MobyEndpoints.System.use((systems) => systems.ping()));
