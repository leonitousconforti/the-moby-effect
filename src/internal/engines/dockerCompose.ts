import type * as Socket from "@effect/platform/Socket";
import type * as ParseResult from "effect/ParseResult";
import type * as DockerComposeEngine from "../../DockerComposeEngine.js";

import * as PlatformError from "@effect/platform/Error";
import * as Array from "effect/Array";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Predicate from "effect/Predicate";
import * as Record from "effect/Record";
import * as Scope from "effect/Scope";
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

    const dindContainerId = yield* DockerEngine.runScoped({
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

    // Helper to upload the project to the dind
    const uploadProject = <E1>(
        project: Stream.Stream<Uint8Array, E1, never>
    ): Effect.Effect<void, E1 | DockerComposeError, never> =>
        Effect.catchTag(
            containers.putArchive(dindContainerId, { path: "/", stream: project }),
            "ContainersError",
            (cause) => new DockerComposeError({ method: "uploadProject", cause })
        );

    // Convert a string from camelCase to kebab-case
    const camelToKebab = Function.compose(String.camelToSnake, String.snakeToKebab);

    // Stringify options for a command
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

    // Helper to run a command in the dind
    const runCommand = (
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
        Function.pipe(
            DockerEngine.execWebsocketsNonBlocking({
                containerId: dindContainerId,
                command: `COMPOSE_STATUS_STDOUT=1 docker compose ${method} ${stringifyOptions(options)} ${Array.join(services, " ")}`,
            }),
            Effect.flatMap(MobyDemux.fan),
            Effect.map(({ stderr, stdout }) => MobyDemux.mergeToTaggedStream(stdout, stderr)),
            Stream.unwrapScoped,
            Stream.flatMap(({ _tag, value }) =>
                _tag === "stdout" ? Stream.succeed(value) : Stream.fail(new TextDecoder().decode(value))
            ),
            Stream.mapError((cause) => new DockerComposeError({ method, cause })),
            Stream.provideService(MobyEndpoints.Containers, containers)
        );

    // Actual compose implementation
    return DockerCompose.of({
        [TypeId]: TypeId,

        build: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.BuildOptions | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("build", services, { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        config: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.ConfigOptions | undefined
        ): Effect.Effect<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("config", services, { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.run(Sink.mkString)
            ),

        // cp: <E1>(
        //     project: Stream.Stream<Uint8Array, E1, never>,
        //     service: string,
        //     srcPath: string,
        //     destPath: string,
        //     options?: DockerComposeEngine.CopyOptions | undefined
        // ): Stream.Stream<Uint8Array, E1 | DockerComposeError, never> => {},

        create: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.CreateOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("create", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        down: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.DownOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("down", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        // events: <E1>(
        //     project: Stream.Stream<Uint8Array, E1, never>,
        //     services?: Array<string> | undefined,
        //     options?: DockerComposeEngine.EventsOptions | undefined
        // ): Stream.Stream<Uint8Array, E1 | DockerComposeError, never> => {},

        // exec: <E1>(
        //     project: Stream.Stream<Uint8Array, E1, never>,
        //     service: string,
        //     command: string,
        //     args?: Array<string> | undefined,
        //     options?: DockerComposeEngine.ExecOptions | undefined
        // ): Stream.Stream<Uint8Array, E1 | DockerComposeError, never> => {},

        images: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.ImagesOptions | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("images", services, { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        kill: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.KillOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("kill", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        logs: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.LogsOptions | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("logs", services, { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        ls: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            options?: DockerComposeEngine.ListOptions | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("ls", [], { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        pause: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("pause", services)),
                Stream.unwrap,
                Stream.runDrain
            ),

        // port: <E1>(
        //     project: Stream.Stream<Uint8Array, E1, never>,
        //     service: string,
        //     privatePort: number,
        //     options?: DockerComposeEngine.PortOptions | undefined
        // ): Effect.Effect<number, E1 | DockerComposeError, never> => {},

        ps: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PsOptions | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("ps", services, { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        pull: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PullOptions | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("pull", services, { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        push: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.PushOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("push", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        restart: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.RestartOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("restart", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        rm: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.RmOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("rm", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        // run: <E1>(
        //     project: Stream.Stream<Uint8Array, E1, never>,
        //     service: string,
        //     command: string,
        //     args?: Array<string> | undefined,
        //     options?: DockerComposeEngine.RunOptions | undefined
        // ): Stream.Stream<Uint8Array, E1 | DockerComposeError, never> => {},

        start: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("start", services)),
                Stream.unwrap,
                Stream.runDrain
            ),

        stop: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.StopOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("stop", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        top: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined
        ): Stream.Stream<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("top", services)),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines
            ),

        unpause: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("unpause", services)),
                Stream.unwrap,
                Stream.runDrain
            ),

        up: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services?: Array<string> | undefined,
            options?: DockerComposeEngine.UpOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("up", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        version: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            options?: DockerComposeEngine.VersionOptions | undefined
        ): Effect.Effect<string, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("version", [], { ...options })),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.run(Sink.mkString)
            ),

        wait: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>,
            services: Array.NonEmptyReadonlyArray<string>,
            options?: DockerComposeEngine.WaitOptions | undefined
        ): Effect.Effect<void, E1 | DockerComposeError, never> =>
            Function.pipe(
                uploadProject(project),
                Effect.map(() => runCommand("wait", services, { ...options })),
                Stream.unwrap,
                Stream.runDrain
            ),

        forProject: <E1>(
            project: Stream.Stream<Uint8Array, E1, never>
        ): Effect.Effect<DockerComposeEngine.DockerComposeProject, E1 | DockerComposeError, never> =>
            makeProjectLayer(project, uploadProject, runCommand),
    });
});

/** @internal */
export const layer: Layer.Layer<
    DockerComposeEngine.DockerCompose,
    MobyEndpoints.SystemsError | MobyEndpoints.ContainersError,
    Layer.Layer.Success<DockerEngine.DockerLayer>
> = Layer.scoped(DockerCompose, make);

/** @internal */
export const makeProjectLayer = <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    uploadProject: (
        project: Stream.Stream<Uint8Array, E1, never>
    ) => Effect.Effect<void, E1 | DockerComposeError, never>,
    runCommand: (
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
): Effect.Effect<DockerComposeEngine.DockerComposeProject, E1 | DockerComposeError, never> =>
    Effect.gen(function* () {
        yield* uploadProject(project);

        return {
            [DockerComposeProjectTypeId]: DockerComposeProjectTypeId,

            build: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.BuildOptions | undefined
            ): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("build", services, { ...options }), Stream.decodeText(), Stream.splitLines),

            config: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.ConfigOptions | undefined
            ): Effect.Effect<string, DockerComposeError, never> =>
                Function.pipe(
                    runCommand("config", services, { ...options }),
                    Stream.decodeText(),
                    Stream.splitLines,
                    Stream.run(Sink.mkString)
                ),

            // cp: (
            //
            //     service: string,
            //     srcPath: string,
            //     destPath: string,
            //     options?: DockerComposeEngine.CopyOptions | undefined
            // ): Stream.Stream<Uint8Array, DockerComposeError, never> => {},

            create: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.CreateOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("create", services, { ...options }), Stream.runDrain),

            down: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.DownOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("down", services, { ...options }), Stream.runDrain),

            // events: (
            //
            //     services?: Array<string> | undefined,
            //     options?: DockerComposeEngine.EventsOptions | undefined
            // ): Stream.Stream<Uint8Array, DockerComposeError, never> => {},

            // exec: (
            //
            //     service: string,
            //     command: string,
            //     args?: Array<string> | undefined,
            //     options?: DockerComposeEngine.ExecOptions | undefined
            // ): Stream.Stream<Uint8Array, DockerComposeError, never> => {},

            images: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.ImagesOptions | undefined
            ): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("images", services, { ...options }), Stream.decodeText(), Stream.splitLines),

            kill: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.KillOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("kill", services, { ...options }), Stream.runDrain),

            logs: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.LogsOptions | undefined
            ): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("logs", services, { ...options }), Stream.decodeText(), Stream.splitLines),

            ls: (
                options?: DockerComposeEngine.ListOptions | undefined
            ): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("ls", [], { ...options }), Stream.decodeText(), Stream.splitLines),

            pause: (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("pause", services), Stream.runDrain),

            // port: (
            //
            //     service: string,
            //     privatePort: number,
            //     options?: DockerComposeEngine.PortOptions | undefined
            // ): Effect.Effect<number, DockerComposeError, never> => {},

            ps: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.PsOptions | undefined
            ): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("ps", services, { ...options }), Stream.decodeText(), Stream.splitLines),

            pull: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.PullOptions | undefined
            ): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("pull", services, { ...options }), Stream.decodeText(), Stream.splitLines),

            push: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.PushOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("push", services, { ...options }), Stream.runDrain),

            restart: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.RestartOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("restart", services, { ...options }), Stream.runDrain),

            rm: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.RmOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("rm", services, { ...options }), Stream.runDrain),

            // run: (
            //
            //     service: string,
            //     command: string,
            //     args?: Array<string> | undefined,
            //     options?: DockerComposeEngine.RunOptions | undefined
            // ): Stream.Stream<Uint8Array, DockerComposeError, never> => {},

            start: (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("start", services), Stream.runDrain),

            stop: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.StopOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("stop", services, { ...options }), Stream.runDrain),

            top: (services?: Array<string> | undefined): Stream.Stream<string, DockerComposeError, never> =>
                Function.pipe(runCommand("top", services), Stream.decodeText(), Stream.splitLines),

            unpause: (services?: Array<string> | undefined): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("unpause", services), Stream.runDrain),

            up: (
                services?: Array<string> | undefined,
                options?: DockerComposeEngine.UpOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("up", services, { ...options }), Stream.runDrain),

            version: (
                options?: DockerComposeEngine.VersionOptions | undefined
            ): Effect.Effect<string, DockerComposeError, never> =>
                Function.pipe(
                    runCommand("version", [], { ...options }),
                    Stream.decodeText(),
                    Stream.run(Sink.mkString)
                ),

            wait: (
                services: Array.NonEmptyReadonlyArray<string>,
                options?: DockerComposeEngine.WaitOptions | undefined
            ): Effect.Effect<void, DockerComposeError, never> =>
                Function.pipe(runCommand("wait", services, { ...options }), Stream.runDrain),
        };
    });

/** @internal */
export const layerProject: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    tagIdentifier: string
) => {
    readonly tag: Context.Tag<DockerComposeEngine.DockerComposeProject, DockerComposeEngine.DockerComposeProject>;
    readonly layer: Layer.Layer<
        DockerComposeEngine.DockerComposeProject,
        E1 | DockerComposeError,
        DockerComposeEngine.DockerCompose
    >;
} = <E1>(project: Stream.Stream<Uint8Array, E1, never>, tagIdentifier: string) => {
    const tag = Context.GenericTag<DockerComposeEngine.DockerComposeProject>(tagIdentifier);
    const effect = Effect.flatMap(DockerCompose, ({ forProject }) => forProject(project));
    const layer = Layer.effect(tag, effect);
    return { tag, layer } as const;
};
