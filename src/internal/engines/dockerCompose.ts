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
const makeTempDirScoped = (
    containerId: string
): Effect.Effect<string, DockerComposeError, MobyEndpoints.Containers | Scope.Scope> =>
    Effect.acquireRelease(
        Effect.gen(function* () {
            const [stderr, stdout] = yield* Effect.mapError(
                DockerEngine.execWebsockets({
                    containerId,
                    command: "mktemp -d",
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

            yield* Effect.annotateCurrentSpan("tempDir", tempDir);
            return tempDir;
        }),
        (tempDir) =>
            Effect.orDieWith(
                DockerEngine.execWebsockets({
                    containerId,
                    command: `rm -rf ${tempDir}`,
                }),
                (cause) =>
                    new DockerComposeError({
                        cause,
                        method: "makeTempDirScoped",
                    })
            )
    );

/** @internal */
const uploadProject = Function.dual<
    <E1, R1>(
        project: Stream.Stream<Uint8Array, E1, R1>
    ) => (
        containerId: string
    ) => Effect.Effect<string, E1 | DockerComposeError, R1 | MobyEndpoints.Containers | Scope.Scope>,
    <E1, R1>(
        containerId: string,
        project: Stream.Stream<Uint8Array, E1, R1>
    ) => Effect.Effect<string, E1 | DockerComposeError, R1 | MobyEndpoints.Containers | Scope.Scope>
>(
    2,
    <E1, R1>(
        containerId: string,
        project: Stream.Stream<Uint8Array, E1, R1>
    ): Effect.Effect<string, E1 | DockerComposeError, R1 | MobyEndpoints.Containers | Scope.Scope> =>
        Effect.gen(function* () {
            const containers = yield* MobyEndpoints.Containers;
            const projectUploadDir = yield* makeTempDirScoped(containerId);
            yield* Effect.annotateCurrentSpan("projectUploadDir", projectUploadDir);
            yield* containers.putArchive(containerId, { stream: project, path: projectUploadDir });
            return projectUploadDir;
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

/** @internal */
const camelToKebab = Function.compose(String.camelToSnake, String.snakeToKebab);

/** @internal */
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

/** @internal */
const runCommand = (
    containerId: string,
    projectPath: string,
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
): Stream.Stream<Uint8Array, DockerComposeError, MobyEndpoints.Containers> =>
    Effect.gen(function* () {
        const multiplexed = yield* DockerEngine.execWebsocketsNonBlocking({
            containerId,
            cwd: projectPath,
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
    );

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
export const make: (options?: {
    dockerEngineSocket?: string | undefined;
}) => Effect.Effect<
    DockerComposeEngine.DockerCompose,
    MobyEndpoints.SystemsError | MobyEndpoints.ContainersError,
    MobyEndpoints.Containers | MobyEndpoints.Systems | Scope.Scope
> = Effect.fnUntraced(function* (options) {
    const containers = yield* MobyEndpoints.Containers;
    const runCommandHelper = Function.flow(runCommand, Stream.provideService(MobyEndpoints.Containers, containers));
    yield* DockerEngine.pingHead();

    const build =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.BuildOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "build", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const config =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.ConfigOptions | undefined
        ): Effect.Effect<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "config", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines,
                Stream.run(Sink.mkString)
            );

    const cpTo =
        (dindContainerId: string, projectPath: string) =>
        <E1, R1>(
            service: string,
            localSrc: Stream.Stream<Uint8Array, E1, R1>,
            remoteDestLocation: string,
            options?: DockerComposeEngine.CopyOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, R1> =>
            Effect.gen(function* () {
                const remoteTransferDir = yield* Effect.provideService(
                    makeTempDirScoped(dindContainerId),
                    MobyEndpoints.Containers,
                    containers
                );
                yield* Effect.mapError(
                    containers.putArchive(dindContainerId, {
                        stream: localSrc,
                        path: remoteTransferDir,
                    }),
                    (cause) => new DockerComposeError({ method: "cpTo", cause })
                );
                const command = `cp ${remoteTransferDir} ${service}:${remoteDestLocation}`;
                return yield* Stream.runDrain(
                    runCommandHelper(dindContainerId, projectPath, command, [], { ...options })
                );
            }).pipe(Effect.scoped);

    const cpFrom =
        (dindContainerId: string, projectPath: string) =>
        (
            service: string,
            remoteSrcLocation: string,
            options?: DockerComposeEngine.CopyOptions | undefined
        ): Stream.Stream<Uint8Array, DockerComposeError, never> =>
            Function.pipe(
                Stream.scoped(makeTempDirScoped(dindContainerId)),
                Stream.provideService(MobyEndpoints.Containers, containers),
                Stream.tap((remoteTransferDir) =>
                    Stream.runDrain(
                        runCommandHelper(
                            projectPath,
                            dindContainerId,
                            `cp ${service}:${remoteSrcLocation} ${remoteTransferDir}`,
                            [],
                            {
                                ...options,
                            }
                        )
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
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.CreateOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "create", services, { ...options }),
                Stream.runDrain
            );

    const down =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.DownOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "down", services, { ...options }),
                Stream.runDrain
            );

    const events =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.EventsOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "events", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const exec =
        (dindContainerId: string, projectPath: string) =>
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
            Effect.provideService(
                DockerEngine.execWebsocketsNonBlocking({
                    containerId: dindContainerId,
                    cwd: projectPath,
                    command: `COMPOSE_STATUS_STDOUT=1 docker compose exec ${stringifyOptions({ ...options })} ${service} ${command} ${Array.join(args ?? [], " ")}`,
                }),
                MobyEndpoints.Containers,
                containers
            );

    const images =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.ImagesOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "images", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const kill =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.KillOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "kill", services, { ...options }),
                Stream.runDrain
            );

    const logs =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.LogsOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "logs", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const ls =
        (dindContainerId: string, projectPath: string) =>
        (options?: DockerComposeEngine.ListOptions | undefined): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "ls", [], { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const pause =
        (dindContainerId: string, projectPath: string) =>
        (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommandHelper(dindContainerId, projectPath, "pause", services), Stream.runDrain);

    const port =
        (dindContainerId: string, projectPath: string) =>
        (
            service: string,
            privatePort: number,
            options?: DockerComposeEngine.PortOptions | undefined
        ): Effect.Effect<number, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "port", [service, privatePort.toString()], {
                    ...options,
                }),
                Stream.decodeText(),
                Stream.splitLines,
                Stream.take(1),
                Stream.runHead,
                Effect.map(Option.flatMap(Number.parse)),
                Effect.map(Option.getOrThrow)
            );

    const ps =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PsOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "ps", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const pull =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PullOptions | undefined
        ): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "pull", services, { ...options }),
                Stream.decodeText(),
                Stream.splitLines
            );

    const push =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PushOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "push", services, { ...options }),
                Stream.runDrain
            );

    const restart =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.RestartOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "restart", services, { ...options }),
                Stream.runDrain
            );

    const rm =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.RmOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "rm", services, { ...options }),
                Stream.runDrain
            );

    const run =
        (dindContainerId: string, projectPath: string) =>
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
            Effect.provideService(
                DockerEngine.execWebsocketsNonBlocking({
                    containerId: dindContainerId,
                    cwd: projectPath,
                    command: `COMPOSE_STATUS_STDOUT=1 docker compose run ${stringifyOptions({ ...options })} ${service} ${command} ${Array.join(args ?? [], " ")}`,
                }),
                MobyEndpoints.Containers,
                containers
            );

    const start =
        (dindContainerId: string, projectPath: string) =>
        (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommandHelper(dindContainerId, projectPath, "start", services), Stream.runDrain);

    const stop =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.StopOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "stop", services, { ...options }),
                Stream.runDrain
            );

    const top =
        (dindContainerId: string, projectPath: string) =>
        (services?: Array<string> | undefined): Stream.Stream<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "top", services),
                Stream.decodeText(),
                Stream.splitLines
            );

    const unpause =
        (dindContainerId: string, projectPath: string) =>
        (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(runCommandHelper(dindContainerId, projectPath, "unpause", services), Stream.runDrain);

    const up =
        (dindContainerId: string, projectPath: string) =>
        (
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.UpOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "up", services, { ...options }),
                Stream.runDrain
            );

    const version =
        (dindContainerId: string, projectPath: string) =>
        (options?: DockerComposeEngine.VersionOptions | undefined): Effect.Effect<string, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "version", [], { ...options }),
                Stream.decodeText(),
                Stream.run(Sink.mkString)
            );

    const wait =
        (dindContainerId: string, projectPath: string) =>
        (
            services: Array.NonEmptyReadonlyArray<string>,
            options?: DockerComposeEngine.WaitOptions | undefined
        ): Effect.Effect<void, DockerComposeError, never> =>
            Function.pipe(
                runCommandHelper(dindContainerId, projectPath, "wait", services, { ...options }),
                Stream.runDrain
            );

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
                Binds: [`${options?.dockerEngineSocket ?? "/var/run/docker.sock"}:/var/run/docker.sock`],
            },
        },
    }).pipe(Effect.map(({ Id }) => Id));

    const uncurryEffectWithUploadProject =
        (dindContainerId: string) =>
        <P extends Array<any>, A, E, R>(
            func: (dindContainerId: string, projectPath: string) => (...args: P) => Effect.Effect<A, E, R>
        ) =>
        <E1, R1>(
            project: Stream.Stream<Uint8Array, E1, R1>,
            ...args: P
        ): Effect.Effect<A, E | E1 | DockerComposeError, Exclude<R, Scope.Scope> | Exclude<R1, Scope.Scope>> =>
            uploadProject(project)(dindContainerId)
                .pipe(Effect.provideService(MobyEndpoints.Containers, containers))
                .pipe(Effect.flatMap((cwd) => func(dindContainerId, cwd)(...args)))
                .pipe(Effect.scoped);

    const uncurryStreamWithUploadProject =
        (dindContainerId: string) =>
        <P extends Array<any>, A, E, R>(
            func: (dindContainerId: string, projectPath: string) => (...args: P) => Stream.Stream<A, E, R>
        ) =>
        <E1, R1>(
            project: Stream.Stream<Uint8Array, E1, R1>,
            ...args: P
        ): Stream.Stream<A, E | E1 | DockerComposeError, R | R1> =>
            uploadProject(project)(dindContainerId)
                .pipe(Stream.scoped)
                .pipe(Stream.provideService(MobyEndpoints.Containers, containers))
                .pipe(Stream.flatMap((cwd) => func(dindContainerId, cwd)(...args)));

    const uncurryEffect = uncurryEffectWithUploadProject(dindContainerIdResource);
    const uncurryStream = uncurryStreamWithUploadProject(dindContainerIdResource);

    // Actual compose implementation
    return DockerCompose.of({
        [TypeId]: TypeId,
        build: uncurryStream(build),
        config: uncurryEffect(config),
        cpTo: <E1, R1, E2, R2>(
            project: Stream.Stream<Uint8Array, E1, R1>,
            service: string,
            localSrc: Stream.Stream<Uint8Array, E2, R2>,
            remoteDestLocation: string,
            options?: DockerComposeEngine.CopyOptions | undefined
        ): Effect.Effect<void, E1 | E2 | DockerComposeError, Exclude<R1, Scope.Scope> | Exclude<R2, Scope.Scope>> =>
            Effect.gen(function* () {
                const cwd = yield* Effect.provideService(
                    uploadProject(project)(dindContainerIdResource),
                    MobyEndpoints.Containers,
                    containers
                );
                yield* cpTo(dindContainerIdResource, cwd)(service, localSrc, remoteDestLocation, options);
            }).pipe(Effect.scoped),
        cpFrom: uncurryStream(cpFrom),
        create: uncurryEffect(create),
        down: uncurryEffect(down),
        events: uncurryStream(events),
        exec: uncurryEffect(exec),
        images: uncurryStream(images),
        kill: uncurryEffect(kill),
        logs: uncurryStream(logs),
        ls: uncurryStream(ls),
        pause: uncurryEffect(pause),
        port: uncurryEffect(port),
        ps: uncurryStream(ps),
        pull: uncurryStream(pull),
        push: uncurryEffect(push),
        restart: uncurryEffect(restart),
        rm: uncurryEffect(rm),
        run: uncurryEffect(run),
        start: uncurryEffect(start),
        stop: uncurryEffect(stop),
        top: uncurryStream(top),
        unpause: uncurryEffect(unpause),
        up: uncurryEffect(up),
        version: uncurryEffect(version),
        wait: uncurryEffect(wait),
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
                            Binds: [`${options?.dockerEngineSocket ?? "/var/run/docker.sock"}:/var/run/docker.sock`],
                        },
                    },
                })
                    .pipe(Effect.map(({ Id }) => Id))
                    .pipe(Effect.provideService(MobyEndpoints.Containers, containers));

                const cwd = yield* Effect.provideService(
                    uploadProject(projectDindContainerIdResource, project),
                    MobyEndpoints.Containers,
                    containers
                );

                return {
                    [DockerComposeProjectTypeId]: DockerComposeProjectTypeId,
                    build: build(projectDindContainerIdResource, cwd),
                    config: config(projectDindContainerIdResource, cwd),
                    cpTo: cpTo(projectDindContainerIdResource, cwd),
                    cpFrom: cpFrom(projectDindContainerIdResource, cwd),
                    create: create(projectDindContainerIdResource, cwd),
                    down: down(projectDindContainerIdResource, cwd),
                    events: events(projectDindContainerIdResource, cwd),
                    exec: exec(projectDindContainerIdResource, cwd),
                    images: images(projectDindContainerIdResource, cwd),
                    kill: kill(projectDindContainerIdResource, cwd),
                    logs: logs(projectDindContainerIdResource, cwd),
                    ls: ls(projectDindContainerIdResource, cwd),
                    pause: pause(projectDindContainerIdResource, cwd),
                    port: port(projectDindContainerIdResource, cwd),
                    ps: ps(projectDindContainerIdResource, cwd),
                    pull: pull(projectDindContainerIdResource, cwd),
                    push: push(projectDindContainerIdResource, cwd),
                    restart: restart(projectDindContainerIdResource, cwd),
                    rm: rm(projectDindContainerIdResource, cwd),
                    run: run(projectDindContainerIdResource, cwd),
                    start: start(projectDindContainerIdResource, cwd),
                    stop: stop(projectDindContainerIdResource, cwd),
                    top: top(projectDindContainerIdResource, cwd),
                    unpause: unpause(projectDindContainerIdResource, cwd),
                    up: up(projectDindContainerIdResource, cwd),
                    version: version(projectDindContainerIdResource, cwd),
                    wait: wait(projectDindContainerIdResource, cwd),
                };
            }),
    });
});

/** @internal */
export const layer = (
    options?: { dockerEngineSocket?: string | undefined } | undefined
): Layer.Layer<
    DockerComposeEngine.DockerCompose,
    MobyEndpoints.SystemsError | MobyEndpoints.ContainersError,
    Layer.Layer.Success<DockerEngine.DockerLayer>
> => Layer.scoped(DockerCompose, make(options));

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
