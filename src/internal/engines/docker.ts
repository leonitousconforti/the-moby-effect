import type * as Scope from "effect/Scope";
import type * as Socket from "effect/unstable/socket/Socket";

import * as Array from "effect/Array";
import * as Channel from "effect/Channel";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as MutableHashMap from "effect/MutableHashMap";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Semaphore from "effect/Semaphore";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import type * as DockerEngine from "../../DockerEngine.js";
import type * as MobySchemas from "../../MobySchemas.js";
import type * as IdSchemas from "../schemas/id.js";

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
    Stream.unwrap(
        Effect.map(MobyEndpoints.Images, (images) =>
            images.create({
                fromImage: image,
                platform,
            })
        )
    );

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
        Effect.map(MobyEndpoints.Images, (images) =>
            images.build(context, {
                buildargs,
                dockerfile,
                platform,
                t: tag,
            })
        )
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
    options: Omit<(typeof MobySchemas.ContainerCreateRequest)["~type.make.in"], "HostConfig"> & {
        readonly name?: string | undefined;
        readonly platform?: string | undefined;
        readonly HostConfig?: (typeof MobySchemas.ContainerHostConfig)["~type.make.in"] | undefined;
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
    options: Omit<(typeof MobySchemas.ContainerCreateRequest)["~type.make.in"], "HostConfig"> & {
        readonly name?: string | undefined;
        readonly platform?: string | undefined;
        readonly HostConfig?: (typeof MobySchemas.ContainerHostConfig)["~type.make.in"] | undefined;
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

    return Effect.acquireRelease(acquire, release).pipe(
        Effect.tap((containerId) => start(containerId)),
        Effect.flatMap((containerId) => MobyEndpoints.Containers.use((containers) => containers.inspect(containerId)))
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
            Detach: false,
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
    [exitCode: bigint, output: string],
    DockerEngine.DockerError | Schema.SchemaError | Socket.SocketError,
    MobyEndpoints.Execs
> =>
    Effect.gen(function* () {
        const [socket, execId] = yield* execNonBlocking({ command, containerId, detach: false });
        const output = yield* MobyDemux.demuxToSingleSink(
            socket,
            Stream.never,
            Sink.reduce(
                () => "",
                (acc, chunk) => acc + chunk
            )
        );

        const execInspectResponse = yield* MobyEndpoints.Execs.use((execs) => execs.inspect(execId));
        if (execInspectResponse.Running === true) return yield* Effect.die("Exec is still running");
        else return Tuple.make(execInspectResponse.ExitCode, output);
    });

/**
 * Serializes websocket execs per container. Attach websockets talk to the
 * container's single stdio (there is no exec-create over websockets), so
 * concurrent execs against the same container would interleave their input
 * and output. Entries are reference counted and evicted once the last
 * in-flight exec for a container releases.
 *
 * @internal
 */
const execWebsocketsRegistry = MutableHashMap.empty<
    string,
    { readonly semaphore: Semaphore.Semaphore; pending: number }
>();

/**
 * Runs a command in a container by typing it into the container's own
 * stdin-attached shell over attach websockets - the websocket transport has
 * no exec-create endpoint, attach only talks to the container's main process.
 * This shapes everything unusual about this function: the container's
 * entrypoint must be a known shell (the command text is fed to it on stdin),
 * the command is suffixed with `; exit` so the shell terminates and the
 * daemon flushes and closes the attach streams, and afterwards the container
 * is restarted to return it to a usable state for subsequent execs.
 *
 * @internal
 */
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

        const acquire = Effect.gen(function* () {
            const inspect = yield* containers.inspect(containerId);
            const command = inspect.Config?.Cmd;
            const entrypoint = Option.fromNullishOr(inspect.Config?.Entrypoint).pipe(
                Option.flatMap(Array.head),
                Option.getOrUndefined
            );

            yield* Schema.decodeUnknownEffect(Schema.Union([Schema.Undefined, Schema.Null]))(command).pipe(
                Effect.mapError(
                    (cause) =>
                        new internalCircular.DockerError({
                            module: "containers",
                            method: "execWebsocketsNonBlocking",
                            cause,
                        })
                )
            );
            yield* Schema.decodeUnknownEffect(
                Schema.Literals([
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

            // The registry lookup, insert, and reference count increment must
            // stay in one synchronous step so concurrent execs cannot observe
            // a half-registered entry. The increment happens only after the
            // validations above so a failed acquire never leaks a reference.
            const entry = MutableHashMap.get(execWebsocketsRegistry, containerId).pipe(
                Option.getOrElse(() => {
                    const fresh = { semaphore: Semaphore.makeUnsafe(1), pending: 0 };
                    MutableHashMap.set(execWebsocketsRegistry, containerId, fresh);
                    return fresh;
                })
            );

            entry.pending += 1;
            yield* entry.semaphore.take(1);
            return entry;
        });

        // TODO: should this be un-interuptible?
        const release = (entry: { readonly semaphore: Semaphore.Semaphore; pending: number }) =>
            entry.semaphore.release(1).pipe(
                Effect.andThen(containers.wait(containerId, { condition: "not-running" })),
                Effect.andThen(containers.start(containerId)),
                Effect.orDie,
                Effect.ensuring(
                    Effect.sync(() => {
                        entry.pending -= 1;
                        if (entry.pending === 0) {
                            MutableHashMap.remove(execWebsocketsRegistry, containerId);
                        }
                    })
                )
            );

        const use = Effect.gen(function* () {
            const cmd = Predicate.isString(command) ? command : Array.join(command, " ");
            const cwdCommand = Predicate.isUndefined(cwd) ? cmd : `cd ${cwd} && ${cmd}`;
            const input = Stream.succeed(`${cwdCommand}; exit\n`);

            // The attaches connect eagerly, so ordering here is meaningful:
            // attach the output sockets before either stdin socket so no
            // output can be produced (and discarded by the daemon) before the
            // output attaches are complete. The command gets its own attach
            // because every raw socket is a single-use connection.
            const stdoutSocket = yield* containers.attachWebsocket(containerId, { stdout: true, stream: true });
            const stderrSocket = yield* containers.attachWebsocket(containerId, { stderr: true, stream: true });
            const stdinSocket = yield* containers.attachWebsocket(containerId, { stdin: true, stream: true });
            const commandSocket = yield* containers.attachWebsocket(containerId, { stdin: true, stream: true });

            const sockets = { stdin: stdinSocket, stdout: stdoutSocket, stderr: stderrSocket } as const;
            const multiplexedSocket = yield* MobyDemux.pack(sockets, { requestedCapacity: 16 });
            const producer = Channel.fromEffectDrain(MobyDemux.demuxRawToSingleSink(commandSocket, input, Sink.drain));
            const consumer = multiplexedSocket.underlying;
            const zipped = Channel.merge(producer, consumer, { haltStrategy: "both" });
            return zipped;
        });

        const multiplexedChannel = Effect.acquireRelease(acquire, release).pipe(
            Effect.map(() => Channel.unwrap(use)),
            Channel.unwrap,
            Channel.provideService(MobyEndpoints.Containers, containers)
        );

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
    DockerEngine.DockerError | Schema.SchemaError | Socket.SocketError,
    MobyEndpoints.Containers
> =>
    Function.pipe(
        execWebsocketsNonBlocking({ command, containerId }),
        Effect.flatMap(
            MobyDemux.demuxMultiplexedToSeparateSinks(
                Stream.empty,
                Sink.reduce(
                    () => "",
                    (acc, chunk) => acc + chunk
                ),
                Sink.reduce(
                    () => "",
                    (acc, chunk) => acc + chunk
                )
            )
        )
    );

/** @internal */
export const ps = (
    options?: Parameters<MobyEndpoints.Containers["Service"]["list"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.ContainerSummary>, DockerEngine.DockerError, MobyEndpoints.Containers> =>
    MobyEndpoints.Containers.use((containers) => containers.list(options));

/** @internal */
export const push = (
    name: string,
    options?: Parameters<MobyEndpoints.Images["Service"]["push"]>[1]
): Stream.Stream<MobySchemas.JSONMessage, DockerEngine.DockerError, MobyEndpoints.Images> =>
    Stream.unwrap(Effect.map(MobyEndpoints.Images, (images) => images.push(name, options)));

/** @internal */
export const images = (
    options?: Parameters<MobyEndpoints.Images["Service"]["list"]>[0]
): Effect.Effect<ReadonlyArray<MobySchemas.ImageSummary>, DockerEngine.DockerError, MobyEndpoints.Images> =>
    MobyEndpoints.Images.use((images) => images.list(options));

/** @internal */
export const search = (
    options: Parameters<MobyEndpoints.Images["Service"]["search"]>[0]
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
