import type * as Socket from "@effect/platform/Socket";
import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as DockerEngine from "../../DockerEngine.js";
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

import * as internalCircular from "../endpoints/circular.js";

/** @internal */
export const pull = ({
    image,
    platform,
}: {
    image: string;
    platform?: string | undefined;
}): Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, MobyEndpoints.Images> =>
    Stream.unwrap(MobyEndpoints.Images.use((images) => images.create({ fromImage: image, platform })));

/** @internal */
export const pullScoped = ({
    image,
    platform,
}: {
    image: string;
    platform?: string | undefined;
}): Effect.Effect<
    Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, never>,
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
}): Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, MobyEndpoints.Images> =>
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
    Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, never>,
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
    containerId: IdSchemas.ContainerIdentifier
): Effect.Effect<void, DockerEngine.DockerError, MobyEndpoints.Containers> =>
    MobyEndpoints.Containers.use((containers) => containers.start(containerId));

/** @internal */
export const stop = (
    containerId: IdSchemas.ContainerIdentifier
): Effect.Effect<void, DockerEngine.DockerError, MobyEndpoints.Containers> =>
    MobyEndpoints.Containers.use((containers) => containers.stop(containerId));

/** @internal */
export const run = (
    options: Omit<ConstructorParameters<typeof MobySchemas.ContainerCreateRequest>[0], "HostConfig"> & {
        readonly name?: string | undefined;
        readonly platform?: string | undefined;
        readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined;
    }
): Effect.Effect<MobySchemas.ContainerInspectResponse, DockerEngine.DockerError, MobyEndpoints.Containers> =>
    Effect.gen(function* () {
        const containers = yield* MobyEndpoints.Containers;
        const { Id: containerId } = yield* containers.create(options);
        yield* containers.start(containerId);
        const inspect = yield* containers.inspect(containerId);
        return inspect;
    });

/** @internal */
export const runScoped = (
    options: Omit<ConstructorParameters<typeof MobySchemas.ContainerCreateRequest>[0], "HostConfig"> & {
        readonly name?: string | undefined;
        readonly platform?: string | undefined;
        readonly HostConfig?: ConstructorParameters<typeof MobySchemas.ContainerHostConfig>[0] | undefined;
    }
): Effect.Effect<
    MobySchemas.ContainerInspectResponse,
    DockerEngine.DockerError,
    Scope.Scope | MobyEndpoints.Containers
> => {
    const acquire = Effect.map(
        MobyEndpoints.Containers.use((containers) => containers.create(options)),
        ({ Id }) => Id
    );
    const release = (containerId: IdSchemas.ContainerIdentifier) =>
        Effect.orDie(MobyEndpoints.Containers.use((containers) => containers.delete(containerId, { force: true })));
    return Effect.acquireRelease(acquire, release)
        .pipe(Effect.tap((containerId) => start(containerId)))
        .pipe(
            Effect.flatMap((containerId) =>
                MobyEndpoints.Containers.use((containers) => containers.inspect(containerId))
            )
        );
};

/** @internal */
export const execNonBlocking = <const T extends boolean = false>({
    command,
    containerId,
    detach,
}: {
    detach: T;
    containerId: IdSchemas.ContainerIdentifier;
    command: string | Array<string>;
}): Effect.Effect<
    [[T] extends [false] ? MobyDemux.RawSocket | MobyDemux.MultiplexedSocket : void, IdSchemas.ExecIdentifier],
    DockerEngine.DockerError,
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

        const socket = yield* execs.start(execId.Id, { Detach: detach, Tty: false });
        return Tuple.make(socket, execId.Id);
    });

/** @internal */
export const exec = ({
    command,
    containerId,
}: {
    containerId: IdSchemas.ContainerIdentifier;
    command: string | Array<string>;
}): Effect.Effect<
    [exitCode: Schema.Schema.Type<Schema.Number>, output: string],
    DockerEngine.DockerError | ParseResult.ParseError | Socket.SocketError,
    MobyEndpoints.Execs
> =>
    Effect.gen(function* () {
        const [socket, execId] = yield* execNonBlocking({ command, containerId, detach: false });
        const output = yield* MobyDemux.demuxToSingleSink(socket, Stream.never, Sink.mkString);
        const execInspectResponse = yield* MobyEndpoints.Execs.use((execs) => execs.inspect(execId));
        if (execInspectResponse.Running === true) return yield* Effect.dieMessage("Exec is still running");
        else return Tuple.make(execInspectResponse.ExitCode, output);
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
    containerId: IdSchemas.ContainerIdentifier;
}): Effect.Effect<
    MobyDemux.MultiplexedChannel<never, DockerEngine.DockerError | Socket.SocketError, never>,
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
            const command = inspect.Config?.Cmd;
            const entrypoint = Option.fromNullable(inspect.Config?.Entrypoint)
                .pipe(Option.flatMap(Array.head))
                .pipe(Option.getOrUndefined);

            yield* Schema.decodeUnknown(Schema.Union(Schema.Undefined, Schema.Null))(command).pipe(
                Effect.mapError(
                    (cause) =>
                        new internalCircular.DockerError({
                            module: "containers",
                            method: "execWebsocketsNonBlocking",
                            cause,
                        })
                )
            );
            yield* Schema.decodeUnknown(
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
            )(entrypoint).pipe(
                Effect.mapError(
                    (cause) =>
                        new internalCircular.DockerError({
                            module: "containers",
                            method: "execWebsocketsNonBlocking",
                            cause,
                        })
                )
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
    containerId: IdSchemas.ContainerIdentifier;
}): Effect.Effect<
    readonly [stdout: string, stderr: string],
    DockerEngine.DockerError | ParseResult.ParseError | Socket.SocketError,
    MobyEndpoints.Containers
> =>
    Function.pipe(
        execWebsocketsNonBlocking({ command, containerId }),
        Effect.flatMap(MobyDemux.demuxMultiplexedToSeparateSinks(Stream.empty, Sink.mkString, Sink.mkString))
    );

/** @internal */
export const ps = (
    options?: Parameters<MobyEndpoints.Containers["list"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.ContainerSummary>, DockerEngine.DockerError, MobyEndpoints.Containers> =>
    MobyEndpoints.Containers.use((containers) => containers.list(options));

/** @internal */
export const push = (
    name: string,
    options?: Parameters<MobyEndpoints.Images["push"]>[1]
): Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, MobyEndpoints.Images> =>
    Stream.unwrap(MobyEndpoints.Images.use((images) => images.push(name, options)));

/** @internal */
export const images = (
    options?: Parameters<MobyEndpoints.Images["list"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, DockerEngine.DockerError, MobyEndpoints.Images> =>
    MobyEndpoints.Images.use((images) => images.list(options));

/** @internal */
export const search = (
    options: Parameters<MobyEndpoints.Images["search"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.RegistrySearchResult>, DockerEngine.DockerError, MobyEndpoints.Images> =>
    MobyEndpoints.Images.use((images) => images.search(options));

/** @internal */
export const version: () => Effect.Effect<MobySchemas.TypesVersion, DockerEngine.DockerError, MobyEndpoints.System> =
    Function.constant(MobyEndpoints.System.use((systems) => systems.version()));

/** @internal */
export const info: () => Effect.Effect<MobySchemas.SystemInfo, DockerEngine.DockerError, MobyEndpoints.System> =
    Function.constant(MobyEndpoints.System.use((systems) => systems.info()));

/** @internal */
export const ping: () => Effect.Effect<void, DockerEngine.DockerError, MobyEndpoints.System> = Function.constant(
    MobyEndpoints.System.use((systems) => systems.ping())
);

/** @internal */
export const pingHead: () => Effect.Effect<void, DockerEngine.DockerError, MobyEndpoints.System> = Function.constant(
    MobyEndpoints.System.use((systems) => systems.ping())
);
