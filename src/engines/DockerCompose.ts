/**
 * Docker compose engine.
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as Socket from "@effect/platform/Socket";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as DindEngine from "./Dind.js";
import * as DockerEngine from "./Docker.js";

import { Function } from "effect";
import { Containers, ContainersError } from "../endpoints/Containers.js";
import { ExecsError } from "../endpoints/Execs.js";
import { ImagesError } from "../endpoints/Images.js";
import { SystemsError } from "../endpoints/System.js";
import { VolumesError } from "../endpoints/Volumes.js";
import { MobyConnectionOptions } from "../MobyConnection.js";

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
    ) => Effect.Effect<DockerComposeProject, E1, never>;
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

/**
 * @since 1.0.0
 * @category Layers
 */
export const makeLayer =
    <
        DockerConstructor extends (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            connectionOptions: any
        ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, unknown, unknown>,
        SupportedConnectionOptions extends MobyConnectionOptions = DockerConstructor extends (
            connectionOptions: infer C
        ) => Layer.Layer<Layer.Layer.Success<DockerEngine.DockerLayer>, infer _E, infer _R>
            ? C
            : never,
        DockerConstructorError = ReturnType<DockerConstructor> extends Layer.Layer<
            Layer.Layer.Success<DockerEngine.DockerLayer>,
            infer E,
            infer _R
        >
            ? E
            : never,
        DockerConstructorContext = ReturnType<DockerConstructor> extends Layer.Layer<
            Layer.Layer.Success<DockerEngine.DockerLayer>,
            infer _E,
            infer R
        >
            ? R
            : never,
    >(
        dockerLayerConstructor: DockerConstructor
    ) =>
    (
        connectionOptionsToHost: SupportedConnectionOptions
    ): Layer.Layer<
        DockerCompose,
        ImagesError | SystemsError | VolumesError | ParseResult.ParseError | ContainersError | DockerConstructorError,
        DockerConstructorContext
    > =>
        Effect.gen(function* () {
            // The generic type of the layer constructor is too wide
            // since we want to be able to pass it as the only required generic
            const dockerLayerConstructorCasted = dockerLayerConstructor as (
                connectionOptions: SupportedConnectionOptions
            ) => Layer.Layer<
                Layer.Layer.Success<DockerEngine.DockerLayer>,
                DockerConstructorError,
                DockerConstructorContext
            >;

            // Building a layer here instead of providing it to the final effect
            // prevents conflicting services with the same tag in the final layer
            const hostDocker = yield* Layer.build(dockerLayerConstructorCasted(connectionOptionsToHost));
            yield* DockerEngine.pingHead().pipe(Effect.provide(hostDocker));

            // Now spawn a dind
            const dindDocker = yield* Layer.build(
                DindEngine.makeDindLayerFromPlatformConstructor(dockerLayerConstructorCasted)({
                    connectionOptionsToHost,
                    exposeDindContainerBy: "https" as const,
                    dindBaseImage: "docker.io/library/docker:dind-rootless" as const,
                })
            );

            // FIXME: need to get this somehow
            const dindContainerId: string = "";

            // Helper to upload the project to the dind
            const uploadProject = <E1>(project: Stream.Stream<Uint8Array, E1, never>): Effect.Effect<void, E1, never> =>
                Effect.gen(function* () {
                    const containers = yield* Containers;
                    containers.putArchive(dindContainerId, { path: "/tmp", stream: project });
                }).pipe(Effect.provide(hostDocker));

            // Helper to run a command in the dind
            const runCommand = (_command: string, method: string): Effect.Effect<string, DockerComposeError, never> =>
                Function.pipe(
                    DockerEngine.exec({ containerId: dindContainerId, command: ["echo", "Hello, World!"] }),
                    Effect.provide(dindDocker),
                    Effect.mapError((cause) => new DockerComposeError({ method, cause }))
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
                        Effect.flatMap(() => runCommand("docker compose --file docker-compose.yml build", "build"))
                    ),

                pull: <E1>(
                    project: Stream.Stream<Uint8Array, E1, never>,
                    _options: {}
                ): Effect.Effect<void, E1 | DockerComposeError, never> =>
                    Function.pipe(
                        uploadProject(project),
                        Effect.flatMap(() => runCommand("docker compose --file docker-compose.yml pull", "pull"))
                    ),

                up: <E1>(
                    project: Stream.Stream<Uint8Array, E1, never>,
                    _options: {}
                ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                    Function.pipe(
                        uploadProject(project),
                        Effect.flatMap(() => runCommand("docker compose --file docker-compose.yml up", "up"))
                    ),

                down: <E1>(
                    project: Stream.Stream<Uint8Array, E1, never>,
                    _options: {}
                ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                    Function.pipe(
                        uploadProject(project),
                        Effect.flatMap(() => runCommand("docker compose --file docker-compose.yml down", "down"))
                    ),

                rm: <E1>(
                    project: Stream.Stream<Uint8Array, E1, never>,
                    _options: {}
                ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                    Function.pipe(
                        uploadProject(project),
                        Effect.flatMap(() => runCommand("docker compose --file docker-compose.yml rm", "rm"))
                    ),

                kill: <E1>(
                    project: Stream.Stream<Uint8Array, E1, never>,
                    _options: {}
                ): Effect.Effect<string, E1 | DockerComposeError, never> =>
                    Function.pipe(
                        uploadProject(project),
                        Effect.flatMap(() => runCommand("docker compose --file docker-compose.yml kill", "kill"))
                    ),

                forProject: <E1>(
                    project: Stream.Stream<Uint8Array, E1, never>
                ): Effect.Effect<DockerComposeProject, E1, never> =>
                    makeProjectLayer(project, uploadProject, runCommand),
            });
        }).pipe(Layer.scoped(DockerCompose));

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerNodeJS = makeLayer(DockerEngine.layerNodeJS);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerBun = makeLayer(DockerEngine.layerBun);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerDeno = makeLayer(DockerEngine.layerDeno);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerUndici = makeLayer(DockerEngine.layerUndici);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerWeb = makeLayer(DockerEngine.layerWeb);

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerAgnostic = makeLayer(DockerEngine.layerAgnostic);

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

/** @internal */
export const makeProjectLayer = <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    uploadProject: (project: Stream.Stream<Uint8Array, E1, never>) => Effect.Effect<void, E1, never>,
    runCommand: (command: string, method: string) => Effect.Effect<string, DockerComposeError, never>
): Effect.Effect<DockerComposeProject, E1, never> =>
    Effect.gen(function* () {
        yield* uploadProject(project);

        const build = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --file docker-compose.yml build", "build");

        const pull = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --file docker-compose.yml pull", "pull");

        const up = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --file docker-compose.yml up", "up");

        const down = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --file docker-compose.yml down", "down");

        const rm = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --file docker-compose.yml rm", "rm");

        const kill = (_options: {}): Effect.Effect<void, DockerComposeError, never> =>
            runCommand("docker compose --file docker-compose.yml kill", "kill");

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
    readonly layer: Layer.Layer<DockerComposeProject, E1, DockerCompose>;
} = <E1>(project: Stream.Stream<Uint8Array, E1, never>, tagIdentifier: string) => {
    const tag = Context.GenericTag<DockerComposeProject>(tagIdentifier);
    const effect = Effect.flatMap(DockerCompose, ({ forProject }) => forProject(project));
    const layer = Layer.effect(tag, effect);
    return { tag, layer } as const;
};
