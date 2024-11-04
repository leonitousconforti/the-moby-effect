/**
 * Compose engine.
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as Socket from "@effect/platform/Socket";
import * as Console from "effect/Console";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as DockerEngine from "./Docker.js";

import { Containers, ContainersError } from "../endpoints/Containers.js";
import { Execs, ExecsError } from "../endpoints/Execs.js";
import { Systems, SystemsError } from "../endpoints/System.js";
import { HttpConnectionOptionsTagged, HttpsConnectionOptionsTagged, MobyConnectionOptions } from "../MobyConnection.js";

/**
 * @since 1.0.0
 * @category Type id
 */
export const TypeId: unique symbol = Symbol.for("@the-moby-effect/engines/DockerCompose") as TypeId;

/**
 * @since 1.0.0
 * @category Type id
 */
export type TypeId = typeof TypeId;

/**
 * @since 1.0.0
 * @category Models
 */
export interface DockerCompose {
    readonly [TypeId]: TypeId;

    readonly build: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options: {}
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly pull: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options: {}
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly up: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options: {}
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly down: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options: {}
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly rm: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options: {}
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly kill: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options: {}
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly forProject: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>
    ) => Effect.Effect<DockerComposeProject, E1 | DockerComposeError, never>;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export const DockerCompose: Context.Tag<DockerCompose, DockerCompose> = Context.GenericTag<DockerCompose>(
    "@the-moby-effect/engines/DockerCompose"
);

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const DockerComposeErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/engines/DockerCompose/DockerComposeError"
) as DockerComposeErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export type DockerComposeErrorTypeId = typeof DockerComposeErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isDockerComposeError = (u: unknown): u is DockerComposeError =>
    Predicate.hasProperty(u, DockerComposeErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class DockerComposeError extends PlatformError.TypeIdError(DockerComposeErrorTypeId, "DockerComposeError")<{
    method: string;
    cause: ParseResult.ParseError | Socket.SocketError | ExecsError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

const make: Effect.Effect<DockerCompose, SystemsError | ContainersError, Execs | Containers | Systems | Scope.Scope> =
    Effect.gen(function* () {
        const execs = yield* Execs;
        const containers = yield* Containers;
        yield* DockerEngine.pingHead();

        const dindContainerId = yield* DockerEngine.runScoped({
            spec: {
                Image: "docker.io/library/docker:latest",
                Cmd: ["sleep", "infinity"],
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

        // Helper to run a command in the dind
        const runCommand = (command: string, method: string): Effect.Effect<string, DockerComposeError, never> =>
            Function.pipe(
                DockerEngine.exec({ containerId: dindContainerId, command: command.split(" ") }),
                Effect.tap(Console.log),
                Effect.mapError((cause) => new DockerComposeError({ method, cause })),
                Effect.provide(Context.make(Execs, execs))
            );

        // Actual compose implementation
        return DockerCompose.of({
            [TypeId]: TypeId,

            build: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>,
                _options: {}
            ): Effect.Effect<void, E1 | DockerComposeError, never> =>
                Function.pipe(
                    uploadProject(project),
                    Effect.flatMap(() =>
                        runCommand("docker compose --project-name test --file docker-compose.yml build", "build")
                    )
                ),

            pull: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>,
                _options: {}
            ): Effect.Effect<void, E1 | DockerComposeError, never> =>
                Function.pipe(
                    uploadProject(project),
                    Effect.flatMap(() =>
                        runCommand("docker compose --project-name test --file docker-compose.yml pull", "pull")
                    )
                ),

            up: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>,
                _options: {}
            ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                Function.pipe(
                    uploadProject(project),
                    Effect.flatMap(() =>
                        runCommand("docker compose --project-name test --file docker-compose.yml up -d", "up")
                    )
                ),

            down: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>,
                _options: {}
            ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                Function.pipe(
                    uploadProject(project),
                    Effect.flatMap(() =>
                        runCommand("docker compose --project-name test --file docker-compose.yml down", "down")
                    )
                ),

            rm: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>,
                _options: {}
            ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                Function.pipe(
                    uploadProject(project),
                    Effect.flatMap(() =>
                        runCommand("docker compose --project-name test --file docker-compose.yml rm", "rm")
                    )
                ),

            kill: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>,
                _options: {}
            ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                Function.pipe(
                    uploadProject(project),
                    Effect.flatMap(() =>
                        runCommand("docker compose --project-name test --file docker-compose.yml kill", "kill")
                    )
                ),

            forProject: <E1>(
                project: Stream.Stream<Uint8Array, E1, never>
            ): Effect.Effect<DockerComposeProject, E1 | DockerComposeError, never> =>
                makeProjectLayer(project, uploadProject, runCommand),
        });
    });

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<DockerCompose, SystemsError | ContainersError, never> =>
    Layer.provide(Layer.scoped(DockerCompose, make), DockerEngine.layerNodeJS(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<DockerCompose, SystemsError | ContainersError, never> =>
    Layer.provide(Layer.scoped(DockerCompose, make), DockerEngine.layerBun(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<DockerCompose, SystemsError | ContainersError, never> =>
    Layer.provide(Layer.scoped(DockerCompose, make), DockerEngine.layerDeno(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<DockerCompose, SystemsError | ContainersError, never> =>
    Layer.provide(Layer.scoped(DockerCompose, make), DockerEngine.layerUndici(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): Layer.Layer<DockerCompose, SystemsError | ContainersError, never> =>
    Layer.provide(Layer.scoped(DockerCompose, make), DockerEngine.layerWeb(connectionOptions));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic = (
    connectionOptions: HttpConnectionOptionsTagged | HttpsConnectionOptionsTagged
): Layer.Layer<
    DockerCompose,
    SystemsError | ContainersError,
    HttpClient.HttpClient<HttpClientError.HttpClientError, Scope.Scope>
> => Layer.provide(Layer.scoped(DockerCompose, make), DockerEngine.layerAgnostic(connectionOptions));

/**
 * @since 1.0.0
 * @category Type id
 */
export const DockerComposeProjectTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/engines/DockerComposeProject"
) as DockerComposeProjectTypeId;

/**
 * @since 1.0.0
 * @category Type id
 */
export type DockerComposeProjectTypeId = typeof DockerComposeProjectTypeId;

/**
 * @since 1.0.0
 * @category Models
 */
export interface DockerComposeProject {
    readonly [DockerComposeProjectTypeId]: DockerComposeProjectTypeId;
    readonly build: (options: {}) => Effect.Effect<void, DockerComposeError, never>;
    readonly pull: (options: {}) => Effect.Effect<void, DockerComposeError, never>;
    readonly up: (options: {}) => Effect.Effect<void, DockerComposeError, never>;
    readonly down: (options: {}) => Effect.Effect<void, DockerComposeError, never>;
    readonly rm: (options: {}) => Effect.Effect<void, DockerComposeError, never>;
    readonly kill: (options: {}) => Effect.Effect<void, DockerComposeError, never>;
}

const makeProjectLayer = <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    uploadProject: (
        project: Stream.Stream<Uint8Array, E1, never>
    ) => Effect.Effect<void, E1 | DockerComposeError, never>,
    runCommand: (command: string, method: string) => Effect.Effect<string, DockerComposeError, never>
): Effect.Effect<DockerComposeProject, E1 | DockerComposeError, never> =>
    Effect.gen(function* () {
        yield* uploadProject(project);

        const build = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --project-name test --file docker-compose.yml build", "build");

        const pull = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --project-name test --file docker-compose.yml pull", "pull");

        const up = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --project-name test --file docker-compose.yml up -d", "up");

        const down = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --project-name test --file docker-compose.yml down", "down");

        const rm = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --project-name test --file docker-compose.yml rm", "rm");

        const kill = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --project-name test --file docker-compose.yml kill", "kill");

        return {
            [DockerComposeProjectTypeId]: DockerComposeProjectTypeId,
            build,
            pull,
            up,
            down,
            rm,
            kill,
        };
    });

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerProject: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    tagIdentifier: string
) => {
    readonly tag: Context.Tag<DockerComposeProject, DockerComposeProject>;
    readonly layer: Layer.Layer<DockerComposeProject, E1 | DockerComposeError, DockerCompose>;
} = <E1>(project: Stream.Stream<Uint8Array, E1, never>, tagIdentifier: string) => {
    const tag = Context.GenericTag<DockerComposeProject>(tagIdentifier);
    const effect = Effect.flatMap(DockerCompose, ({ forProject }) => forProject(project));
    const layer = Layer.effect(tag, effect);
    return { tag, layer } as const;
};
