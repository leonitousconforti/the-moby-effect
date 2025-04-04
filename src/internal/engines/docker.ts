import type * as Socket from "@effect/platform/Socket";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as MobySchemas from "../../MobySchemas.js";

import * as Array from "effect/Array";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Global from "effect/GlobalValue";
import * as Match from "effect/Match";
import * as MutableHashMap from "effect/MutableHashMap";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";
import * as MobyDemux from "../../MobyDemux.js";
import * as MobyEndpoints from "../../MobyEndpoints.js";

/** @internal */
export const pull = ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}): Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images> =>
    Stream.unwrap(
        MobyEndpoints.Images.use((images) => images.create({ fromImage: image, "X-Registry-Auth": auth, platform }))
    );

/** @internal */
export const pullScoped = ({
    auth,
    image,
    platform,
}: {
    image: string;
    auth?: string | undefined;
    platform?: string | undefined;
}): Effect.Effect<
    Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, never>,
    never,
    MobyEndpoints.Images | Scope.Scope
> =>
    Effect.Do.pipe(
        Effect.bind("images", () => MobyEndpoints.Images),
        Effect.let("stream", () => pull({ image, auth, platform })),
        Effect.let("acquire", ({ images, stream }) => Stream.provideService(stream, MobyEndpoints.Images, images)),
        Effect.let("release", ({ images }) => images.delete({ name: image })),
        Effect.flatMap(({ acquire, release }) =>
            Effect.acquireRelease(
                Effect.sync(() => acquire),
                () => Effect.orDie(release)
            )
        )
    );

/** @internal */
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
}): Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, MobyEndpoints.Images> =>
    Stream.unwrap(
        MobyEndpoints.Images.use((images) =>
            images.build({ context, buildArgs, dockerfile, platform, t: tag, "X-Registry-Config": auth })
        )
    );

/** @internal */
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
    Stream.Stream<MobySchemas.JSONMessage, MobyEndpoints.ImagesError, never>,
    never,
    Scope.Scope | MobyEndpoints.Images
> =>
    Effect.Do.pipe(
        Effect.bind("images", () => MobyEndpoints.Images),
        Effect.let("stream", () => build({ tag, buildArgs, auth, context, platform, dockerfile })),
        Effect.let("acquire", ({ images, stream }) => Stream.provideService(stream, MobyEndpoints.Images, images)),
        Effect.let("release", ({ images }) => images.delete({ name: tag })),
        Effect.flatMap(({ acquire, release }) =>
            Effect.acquireRelease(
                Effect.sync(() => acquire),
                () => Effect.orDie(release)
            )
        )
    );

/** @internal */
export const start = (
    containerId: string
): Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers> =>
    MobyEndpoints.Containers.use((containers) => containers.start(containerId));

/** @internal */
export const stop = (
    containerId: string
): Effect.Effect<void, MobyEndpoints.ContainersError, MobyEndpoints.Containers> =>
    MobyEndpoints.Containers.use((containers) => containers.stop(containerId));

/** @internal */
export const run = (
    containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
): Effect.Effect<MobySchemas.ContainerInspectResponse, MobyEndpoints.ContainersError, MobyEndpoints.Containers> =>
    Effect.gen(function* () {
        const containers = yield* MobyEndpoints.Containers;
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
                ).pipe(
                    Effect.mapError(
                        (s) => new MobyEndpoints.ContainersError({ method: "inspect", cause: new Error(s) })
                    )
                )
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: MobyEndpoints.ContainersError) => message === "Waiting")
                )
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
                ).pipe(
                    Effect.mapError(
                        (s) => new MobyEndpoints.ContainersError({ method: "inspect", cause: new Error(s) })
                    )
                )
            )
        ).pipe(
            Effect.retry(
                Schedule.spaced(500).pipe(
                    Schedule.whileInput(({ message }: MobyEndpoints.ContainersError) => message === "Waiting")
                )
            )
        );

        yield* waitUntilContainerDeadOrRunning;
        yield* waitUntilContainerHealthy;
        return yield* containers.inspect(containerCreateResponse.Id);
    });

/** @internal */
export const runScoped = (
    containerOptions: Parameters<MobyEndpoints.Containers["create"]>[0]
): Effect.Effect<
    MobySchemas.ContainerInspectResponse,
    MobyEndpoints.ContainersError,
    Scope.Scope | MobyEndpoints.Containers
> => {
    const acquire = run(containerOptions);
    const release = (containerData: MobySchemas.ContainerInspectResponse) =>
        Effect.orDie(
            Effect.gen(function* () {
                const containers = yield* MobyEndpoints.Containers;
                // FIXME: this cleanup should be better
                yield* Effect.catchTag(containers.stop(containerData.Id), "ContainersError", () => Effect.void);
                yield* containers.delete(containerData.Id, { force: true });
            })
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
    containerId: string;
    command: string | Array<string>;
}): Effect.Effect<
    [socket: T extends true ? void : MobyDemux.RawSocket | MobyDemux.MultiplexedSocket, execId: string],
    MobyEndpoints.ExecsError,
    MobyEndpoints.Execs
> =>
    Effect.gen(function* () {
        const execs = yield* MobyEndpoints.Execs;
        const execId = yield* execs.container(containerId, {
            AttachStdin: true,
            AttachStderr: true,
            AttachStdout: true,
            Cmd: Predicate.isString(command) ? command.split(" ") : command,
        });

        const socket = yield* execs.start<T>(execId.Id, { Detach: detach as T });
        return Tuple.make(socket, execId.Id);
    });

/** @internal */
export const exec = ({
    command,
    containerId,
}: {
    containerId: string;
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
}: {
    command: string | Array<string>;
    containerId: string;
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
            const input = Stream.succeed(`${cmd}; exit\n`);
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
    containerId: string;
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
    Readonly<MobySchemas.SystemVersionResponse>,
    MobyEndpoints.SystemsError,
    MobyEndpoints.Systems
> = Function.constant(MobyEndpoints.Systems.use((systems) => systems.version()));

/** @internal */
export const info: () => Effect.Effect<
    Readonly<MobySchemas.SystemInfoResponse>,
    MobyEndpoints.SystemsError,
    MobyEndpoints.Systems
> = Function.constant(MobyEndpoints.Systems.use((systems) => systems.info()));

/** @internal */
export const ping: () => Effect.Effect<"OK", MobyEndpoints.SystemsError, MobyEndpoints.Systems> = Function.constant(
    MobyEndpoints.Systems.use((systems) => systems.ping())
);

/** @internal */
export const pingHead: () => Effect.Effect<void, MobyEndpoints.SystemsError, MobyEndpoints.Systems> = Function.constant(
    MobyEndpoints.Systems.use((systems) => systems.ping())
);
