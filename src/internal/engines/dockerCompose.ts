import type * as ParseResult from "effect/ParseResult";
import type * as Scope from "effect/Scope";
import type * as DockerComposeEngine from "../../DockerComposeEngine.js";

import * as PlatformError from "@effect/platform/Error";
import * as Socket from "@effect/platform/Socket";
import * as Array from "effect/Array";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Number from "effect/Number";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Record from "effect/Record";
import * as Schema from "effect/Schema";
import * as Sink from "effect/Sink";
import * as Stream from "effect/Stream";
import * as String from "effect/String";
import * as Tuple from "effect/Tuple";
import * as DockerEngine from "../../DockerEngine.js";
import * as MobyDemux from "../../MobyDemux.js";
import * as MobyEndpoints from "../../MobyEndpoints.js";

/** @internal */
export const DockerComposeErrorTypeId: DockerComposeEngine.DockerComposeErrorTypeId = Symbol.for(
    "@the-moby-effect/engines/DockerCompose/DockerComposeError"
) as DockerComposeEngine.DockerComposeErrorTypeId;

/** @internal */
export const TypeId: DockerComposeEngine.TypeId = Symbol.for(
    "@the-moby-effect/engines/DockerCompose"
) as DockerComposeEngine.TypeId;

/** @internal */
export const DockerComposeProjectTypeId: DockerComposeEngine.DockerComposeProjectTypeId = Symbol.for(
    "@the-moby-effect/engines/DockerComposeProject"
) as DockerComposeEngine.DockerComposeProjectTypeId;

/** @internal */
export const isDockerComposeError = (u: unknown): u is DockerComposeError =>
    Predicate.hasProperty(u, DockerComposeErrorTypeId);

/** @internal */
export class DockerComposeError extends PlatformError.TypeIdError(DockerComposeErrorTypeId, "DockerComposeError")<{
    method: string;
    cause: ParseResult.ParseError | Socket.SocketError | MobyEndpoints.ExecsError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/** @internal */
export const DockerCompose: Context.Tag<DockerComposeEngine.DockerCompose, DockerComposeEngine.DockerCompose> =
    Context.GenericTag<DockerComposeEngine.DockerCompose>("@the-moby-effect/engines/DockerCompose");

/** @internal */
export const make: Effect.Effect<
    DockerComposeEngine.DockerCompose,
    MobyEndpoints.SystemsError | MobyEndpoints.ContainersError,
    MobyEndpoints.Containers | MobyEndpoints.Systems | Scope.Scope
> = Effect.gen(function* () {
    const containers = yield* MobyEndpoints.Containers;
    yield* DockerEngine.pingHead();

    const makeTempDirScoped = (dindContainerId: string): Effect.Effect<string, DockerComposeError, Scope.Scope> =>
        Effect.acquireRelease(
            Effect.gen(function* () {
                const [stderr, stdout] = yield* Effect.mapError(
                    DockerEngine.execWebsockets({
                        command: "mktemp -d",
                        containerId: dindContainerId,
                    }),
                    (cause) =>
                        new DockerComposeError({
                            cause,
                            method: "makeTempDirScoped",
                        })
                );

                if (String.isNonEmpty(stderr)) {
                    throw new DockerComposeError({
                        cause: stderr,
                        method: "makeTempDirScoped",
                    });
                }

                class schema extends Schema.startsWith<typeof Schema.String>("/tmp/")(Schema.String) {}
                const tempDir = yield* Effect.mapError(
                    Schema.decode(schema)(stdout),
                    (cause) =>
                        new DockerComposeError({
                            cause,
                            method: "makeTempDirScoped",
                        })
                );

                return tempDir;
            }),
            (tempDir) =>
                Effect.orDieWith(
                    DockerEngine.execWebsockets({
                        command: `rm -rf ${tempDir}`,
                        containerId: dindContainerId,
                    }),
                    (cause) =>
                        new DockerComposeError({
                            cause,
                            method: "makeTempDirScoped",
                        })
                )
        )
            .pipe(Effect.tap((tmpDir) => Effect.annotateCurrentSpan("tempDir", tmpDir)))
            .pipe(Effect.provideService(MobyEndpoints.Containers, containers));

    const uploadProject = Function.dual<
        <E1, R1>(
            project: Stream.Stream<Uint8Array, E1, R1>
        ) => (dindContainerId: string) => Effect.Effect<void, E1 | DockerComposeError, R1 | Scope.Scope>,
        <E1, R1>(
            dindContainerId: string,
            project: Stream.Stream<Uint8Array, E1, R1>
        ) => Effect.Effect<void, E1 | DockerComposeError, R1 | Scope.Scope>
    >(
        2,
        <E1, R1>(
            dindContainerId: string,
            project: Stream.Stream<Uint8Array, E1, R1>
        ): Effect.Effect<void, E1 | DockerComposeError, R1 | Scope.Scope> =>
            Effect.gen(function* () {
                const projectUploadDir = yield* makeTempDirScoped(dindContainerId);
                yield* Effect.annotateCurrentSpan("projectUploadDir", projectUploadDir);
                yield* containers.putArchive(dindContainerId, {
                    path: projectUploadDir,
                    stream: project,
                });
            }).pipe(
                Effect.catchTag(
                    "ContainersError",
                    (cause) =>
                        new DockerComposeError({
                            cause,
                            method: "uploadProject",
                        })
                )
            )
    );

    const camelToKebab = Function.compose(String.camelToSnake, String.snakeToKebab);

    const stringifyOptions = (
        options: Record<
            string,
            | string
            | number
            | boolean
            | undefined
            | Array<string | number | boolean>
            | Record<string, string | number | boolean>
        >
    ): string =>
        Function.pipe(
            options,
            Record.toEntries,
            Array.filter(Function.flow(Tuple.getSecond, Predicate.isNotUndefined)),
            Array.flatMap(([key, value]): Array<readonly [string, string | number | boolean]> => {
                if (Predicate.isString(value) || Predicate.isNumber(value) || Predicate.isBoolean(value)) {
                    return [Tuple.make(key, value)];
                } else if (Array.isArray(value)) {
                    return Array.map(value, (v) => [key, v]);
                } else if (Predicate.isRecord(value)) {
                    return Record.toEntries(value);
                } else {
                    return Function.absurd(value as never);
                }
            }),
            Array.map(([key, value]) => `--${camelToKebab(key)}=${value}`),
            Array.join(" ")
        );

    const runCommand = Function.dual<
        (
            method: string,
            services?: ReadonlyArray<string> | undefined,
            options?:
                | Record<
                      string,
                      | string
                      | number
                      | boolean
                      | undefined
                      | Array<string | number | boolean>
                      | Record<string, string | number | boolean>
                  >
                | undefined
        ) => (dindContainerId: string) => Stream.Stream<Uint8Array, DockerComposeError, never>,
        (
            dindContainerId: string,
            method: string,
            services?: ReadonlyArray<string> | undefined,
            options?:
                | Record<
                      string,
                      | string
                      | number
                      | boolean
                      | undefined
                      | Array<string | number | boolean>
                      | Record<string, string | number | boolean>
                  >
                | undefined
        ) => Stream.Stream<Uint8Array, DockerComposeError, never>
    >(
        (arguments_) => Predicate.isString(arguments_[0]) && Predicate.isString(arguments_[1]),
        (
            dindContainerId: string,
            method: string,
            services: ReadonlyArray<string> | undefined = [],
            options:
                | Record<
                      string,
                      | string
                      | number
                      | boolean
                      | undefined
                      | Array<string | number | boolean>
                      | Record<string, string | number | boolean>
                  >
                | undefined = {}
        ): Stream.Stream<Uint8Array, DockerComposeError, never> =>
            Effect.gen(function* () {
                const multiplexed = yield* DockerEngine.execWebsocketsNonBlocking({
                    containerId: dindContainerId,
                    command: `COMPOSE_STATUS_STDOUT=1 docker compose ${method} ${stringifyOptions(options)} ${Array.join(services, " ")}`,
                });

                const { stderr, stdin, stdout } = yield* MobyDemux.fan(multiplexed, { requestedCapacity: 16 });

                const streamFailableEnsuring = <A, X, E1, E2, R1, R2>(
                    stream: Stream.Stream<A, E1, R1>,
                    effect: Effect.Effect<X, E2, R2>
                ): Stream.Stream<A, E1 | E2, R1 | R2> =>
                    Stream.flatMap(stream, (a: A) => Stream.fromEffect(Effect.map(effect, Function.constant(a))));

                return streamFailableEnsuring(
                    MobyDemux.mergeRawToTaggedStream(stdout, stderr),
                    MobyDemux.demuxRawToSingleSink(stdin, Stream.make(new Socket.CloseEvent()), Sink.drain)
                );
            }).pipe(
                Stream.unwrap,
                Stream.provideService(MobyEndpoints.Containers, containers),
                Stream.mapEffect((entry) => {
                    if (Predicate.isTagged(entry, "stdout")) {
                        return Effect.succeed(entry.value);
                    } else {
                        const decoded = new TextDecoder("utf-8").decode(entry.value);
                        return Effect.fail(new DockerComposeError({ method, cause: decoded }));
                    }
                }),
                Stream.mapError(
                    (cause) =>
                        new DockerComposeError({
                            cause,
                            method,
                        })
                )
            )
    );

    const execOnly = Function.dual<
        (
            command: string,
            args: Array<string> | undefined,
            method: string,
            service: string,
            options?:
                | Record<
                      string,
                      | string
                      | number
                      | boolean
                      | undefined
                      | Array<string | number | boolean>
                      | Record<string, string | number | boolean>
                  >
                | undefined
        ) => (
            dindContainerId: string
        ) => Effect.Effect<
            MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
            never,
            never
        >,
        (
            dindContainerId: string,
            command: string,
            args: Array<string> | undefined,
            method: string,
            service: string,
            options?:
                | Record<
                      string,
                      | string
                      | number
                      | boolean
                      | undefined
                      | Array<string | number | boolean>
                      | Record<string, string | number | boolean>
                  >
                | undefined
        ) => Effect.Effect<
            MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
            never,
            never
        >
    >(
        (arguments_) => Predicate.isString(arguments_[0]) && Predicate.isString(arguments_[1]),
        (
            dindContainerId: string,
            command: string,
            args: Array<string> | undefined,
            method: string,
            service: string,
            options:
                | Record<
                      string,
                      | string
                      | number
                      | boolean
                      | undefined
                      | Array<string | number | boolean>
                      | Record<string, string | number | boolean>
                  >
                | undefined = {}
        ): Effect.Effect<
            MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
            never,
            never
        > =>
            Effect.provideService(
                DockerEngine.execWebsocketsNonBlocking({
                    containerId: dindContainerId,
                    command: `COMPOSE_STATUS_STDOUT=1 docker compose ${method} ${stringifyOptions({ ...options })} ${service} ${command} ${Array.join(args ?? [], " ")}`,
                }),
                MobyEndpoints.Containers,
                containers
            )
    );

    const uncurryWithUploadProject =
        (dindContainerId: string) =>
        <
            A1 extends Array<any>,
            T extends Effect.Effect<any, any, any> | Stream.Stream<any, any, any>,
            A2 extends [T] extends [Effect.Effect<any, any, any>] ? Effect.Effect.Success<T> : Stream.Stream.Success<T>,
            E2 extends [T] extends [Effect.Effect<any, any, any>] ? Effect.Effect.Error<T> : Stream.Stream.Error<T>,
            R2 extends [T] extends [Effect.Effect<any, any, any>] ? Effect.Effect.Context<T> : Stream.Stream.Context<T>,
        >(
            func: (dindContainerId: string) => (...args: A1) => T
        ) =>
        <E1, R1>(
            project: Stream.Stream<Uint8Array, E1, R1>,
            ...args: A1
        ): [T] extends [Effect.Effect<A2, E2, R2>]
            ? Effect.Effect<A2, E1 | E2 | DockerComposeError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
            : Stream.Stream<A2, E1 | E2 | DockerComposeError, Exclude<R1, Scope.Scope> | R2> => {
            const first = uploadProject(project)(dindContainerId);
            const second = func(dindContainerId)(...args);

            type Ret = [T] extends [Effect.Effect<A2, E2, R2>]
                ? Effect.Effect<A2, E1 | E2 | DockerComposeError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>>
                : Stream.Stream<A2, E1 | E2 | DockerComposeError, Exclude<R1, Scope.Scope> | R2>;

            if (Predicate.hasProperty(second, Stream.StreamTypeId)) {
                return Stream.scoped(first).pipe(Stream.flatMap(() => second as Stream.Stream<A2, E2, R2>)) as Ret;
            } else {
                return first.pipe(Effect.flatMap(() => second as Effect.Effect<A2, E2, R2>)).pipe(Effect.scoped) as Ret;
            }
        };

    const build =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.BuildOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "build", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const config =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.ConfigOptions | undefined
        ): Effect.Effect<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "config", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines,
                Stream.run(Sink.mkString)
            );

    const cpTo =
        (dindContainerId: string) =>
        <E1, R1>(
            service: string,
            localSrc: Stream.Stream<Uint8Array, E1, R1>,
            remoteDestLocation: string,
            options?: DockerComposeEngine.CopyOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, R1> =>
            Effect.gen(function* () {
                const remoteTransferDir = yield* makeTempDirScoped(dindContainerId);
                yield* Effect.mapError(
                    containers.putArchive(dindContainerId, {
                        stream: localSrc,
                        path: remoteTransferDir,
                    }),
                    (cause) => new DockerComposeError({ method: "cpTo", cause })
                );
                const command = `cp ${remoteTransferDir} ${service}:${remoteDestLocation}`;
                return yield* Stream.runDrain(runCommand(dindContainerId, command, [], { ...options }));
            }).pipe(Effect.scoped);

    const cpFrom =
        (dindContainerId: string) =>
        (
            service: string,
            remoteSrcLocation: string,
            options?: DockerComposeEngine.CopyOptions | undefined
        ): Stream.Stream<Uint8Array, DockerComposeError, never> =>
            Function.pipe(
                Stream.scoped(makeTempDirScoped(dindContainerId)),
                Stream.tap((remoteTransferDir) =>
                    Stream.runDrain(
                        runCommand(dindContainerId, `cp ${service}:${remoteSrcLocation} ${remoteTransferDir}`, [], {
                            ...options,
                        })
                    )
                ),
                Stream.flatMap((remoteTransferDir) =>
                    Stream.mapError(
                        containers.archive(dindContainerId, {
                            path: remoteTransferDir,
                        }),
                        (cause) =>
                            new DockerComposeError({
                                cause,
                                method: "cpFrom",
                            })
                    )
                )
            );

    const create =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.CreateOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "create", services, { ...options }), Stream.runDrain);

    const down =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.DownOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "down", services, { ...options }), Stream.runDrain);

    const events =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.EventsOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "events", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const exec =
        (dindContainerId: string) =>
        (
            service: string,
            command: string,
            args?: Array<string> | undefined,
            options?: DockerComposeEngine.ExecOptions | undefined
        ): Effect.Effect<
            MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
            DockerComposeError,
            Scope.Scope
        > =>
            execOnly(dindContainerId, command, args, "exec", service, { ...options });

    const images =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.ImagesOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "images", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const kill =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.KillOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "kill", services, { ...options }), Stream.runDrain);

    const logs =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.LogsOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "logs", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const ls =
        (dindContainerId: string) =>
        (options?: DockerComposeEngine.ListOptions | undefined): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "ls", [], { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const pause =
        (dindContainerId: string) =>
        (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "pause", services), Stream.runDrain);

    const port =
        (dindContainerId: string) =>
        (
            service: string,
            privatePort: number,
            options?: DockerComposeEngine.PortOptions | undefined
        ): Effect.Effect<number, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "port", [service, privatePort.toString()], { ...options }),
                Stream.decodeText(),
                Stream.splitLines,
                Stream.take(1),
                Stream.runHead,
                Effect.map(Option.flatMap(Number.parse)),
                Effect.map(Option.getOrThrow)
            );

    const ps =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PsOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "ps", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const pull =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PullOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "pull", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const push =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PushOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "push", services, { ...options }), Stream.runDrain);

    const restart =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.RestartOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "restart", services, { ...options }), Stream.runDrain);

    const rm =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.RmOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "rm", services, { ...options }), Stream.runDrain);

    const run =
        (dindContainerId: string) =>
        (
            service: string,
            command: string,
            args?: Array<string> | undefined,
            options?: DockerComposeEngine.RunOptions | undefined
        ): Effect.Effect<
            MobyDemux.MultiplexedChannel<never, MobyEndpoints.ContainersError | Socket.SocketError, never>,
            DockerComposeError,
            Scope.Scope
        > =>
            execOnly(dindContainerId, command, args, "run", service, { ...options });

    const start =
        (dindContainerId: string) =>
        (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "start", services), Stream.runDrain);

    const stop =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.StopOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "stop", services, { ...options }), Stream.runDrain);

    const top =
        (dindContainerId: string) =>
        (services?: Array<string> | undefined): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "top", services), Stream.decodeText(), Stream.splitLines);

    const unpause =
        (dindContainerId: string) =>
        (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "unpause", services), Stream.runDrain);

    const up =
        (dindContainerId: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.UpOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "up", services, { ...options }), Stream.runDrain);

    const version =
        (dindContainerId: string) =>
        (options?: DockerComposeEngine.VersionOptions | undefined): Effect.Effect<string, DockerComposeError, never> =>
            Function.pipe(
                runCommand(dindContainerId, "version", [], { ...options }),
                Stream.decodeText(),
                Stream.run(Sink.mkString)
            );

    const wait =
        (dindContainerId: string) =>
        (
            services: Array.NonEmptyReadonlyArray<string>,
            options?: DockerComposeEngine.WaitOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommand(dindContainerId, "wait", services, { ...options }), Stream.runDrain);

    const dindContainerIdResource = yield* DockerEngine.runScoped({
        spec: {
            Image: "docker.io/library/docker:latest",
            Entrypoint: ["/bin/sh"],
            Tty: false,
            OpenStdin: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            HostConfig: {
                Privileged: true,
                Binds: ["/var/run/docker.sock:/var/run/docker.sock"],
            },
        },
    }).pipe(Effect.map(({ Id }) => Id));

    // Actual compose implementation
    const uncurryHelper = uncurryWithUploadProject(dindContainerIdResource);
    return DockerCompose.of({
        [TypeId]: TypeId,
        build: uncurryHelper(build),
        config: uncurryHelper(config),
        cpTo: <E1, R1, E2, R2>(
            project: Stream.Stream<Uint8Array, E1, R1>,
            service: string,
            localSrc: Stream.Stream<Uint8Array, E2, R2>,
            remoteDestLocation: string,
            options?: DockerComposeEngine.CopyOptions | undefined
        ): Effect.Effect<void, E1 | E2 | DockerComposeError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =>
            Effect.gen(function* () {
                yield* uploadProject(project)(dindContainerIdResource);
                return yield* cpTo(dindContainerIdResource)(service, localSrc, remoteDestLocation, options);
            }).pipe(Effect.scoped),
        cpFrom: uncurryHelper(cpFrom),
        create: uncurryHelper(create),
        down: uncurryHelper(down),
        events: uncurryHelper(events),
        exec: uncurryHelper(exec),
        images: uncurryHelper(images),
        kill: uncurryHelper(kill),
        logs: uncurryHelper(logs),
        ls: uncurryHelper(ls),
        pause: uncurryHelper(pause),
        port: uncurryHelper(port),
        ps: uncurryHelper(ps),
        pull: uncurryHelper(pull),
        push: uncurryHelper(push),
        restart: uncurryHelper(restart),
        rm: uncurryHelper(rm),
        run: uncurryHelper(run),
        start: uncurryHelper(start),
        stop: uncurryHelper(stop),
        top: uncurryHelper(top),
        unpause: uncurryHelper(unpause),
        up: uncurryHelper(up),
        version: uncurryHelper(version),
        wait: uncurryHelper(wait),
        forProject: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>
        ): Effect.Effect<
            DockerComposeEngine.DockerComposeProject,
            E1 | DockerComposeError | MobyEndpoints.ContainersError,
            Scope.Scope
        > =>
            Effect.gen(function* () {
                const projectDindContainerIdResource = yield* DockerEngine.runScoped({
                    spec: {
                        Image: "docker.io/library/docker:latest",
                        Entrypoint: ["/bin/sh"],
                        Tty: false,
                        OpenStdin: true,
                        AttachStdin: true,
                        AttachStdout: true,
                        AttachStderr: true,
                        HostConfig: {
                            Privileged: true,
                            Binds: ["/var/run/docker.sock:/var/run/docker.sock"],
                        },
                    },
                })
                    .pipe(Effect.map(({ Id }) => Id))
                    .pipe(Effect.provideService(MobyEndpoints.Containers, containers));

                yield* uploadProject(projectDindContainerIdResource, project);
                return {
                    [DockerComposeProjectTypeId]: DockerComposeProjectTypeId,
                    build: build(projectDindContainerIdResource),
                    config: config(projectDindContainerIdResource),
                    cpTo: cpTo(projectDindContainerIdResource),
                    cpFrom: cpFrom(projectDindContainerIdResource),
                    create: create(projectDindContainerIdResource),
                    down: down(projectDindContainerIdResource),
                    events: events(projectDindContainerIdResource),
                    exec: exec(projectDindContainerIdResource),
                    images: images(projectDindContainerIdResource),
                    kill: kill(projectDindContainerIdResource),
                    logs: logs(projectDindContainerIdResource),
                    ls: ls(projectDindContainerIdResource),
                    pause: pause(projectDindContainerIdResource),
                    port: port(projectDindContainerIdResource),
                    ps: ps(projectDindContainerIdResource),
                    pull: pull(projectDindContainerIdResource),
                    push: push(projectDindContainerIdResource),
                    restart: restart(projectDindContainerIdResource),
                    rm: rm(projectDindContainerIdResource),
                    run: run(projectDindContainerIdResource),
                    start: start(projectDindContainerIdResource),
                    stop: stop(projectDindContainerIdResource),
                    top: top(projectDindContainerIdResource),
                    unpause: unpause(projectDindContainerIdResource),
                    up: up(projectDindContainerIdResource),
                    version: version(projectDindContainerIdResource),
                    wait: wait(projectDindContainerIdResource),
                };
            }),
    });
});

/** @internal */
export const layer: Layer.Layer<
    DockerComposeEngine.DockerCompose,
    MobyEndpoints.SystemsError | MobyEndpoints.ContainersError,
    Layer.Layer.Success<DockerEngine.DockerLayer>
> = Layer.scoped(DockerCompose, make);

/** @internal */
export const layerProject: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    tagIdentifier: string
) => {
    readonly tag: Context.Tag<DockerComposeEngine.DockerComposeProject, DockerComposeEngine.DockerComposeProject>;
    readonly layer: Layer.Layer<
        DockerComposeEngine.DockerComposeProject,
        E1 | DockerComposeError | MobyEndpoints.ContainersError,
        DockerComposeEngine.DockerCompose
    >;
} = <E1>(project: Stream.Stream<Uint8Array, E1, never>, tagIdentifier: string) => {
    const tag = Context.GenericTag<DockerComposeEngine.DockerComposeProject>(tagIdentifier);
    const effect = Effect.flatMap(DockerCompose, ({ forProject }) => forProject(project));
    const layer = Layer.scoped(tag, effect);
    return { tag, layer } as const;
};
