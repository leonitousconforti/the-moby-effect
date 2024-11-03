/**
 * Docker compose engine.
 *
 * @since 1.0.0
 */

import * as FileSystem from "@effect/platform/FileSystem";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

import { Containers, ContainersError } from "../endpoints/Containers.js";
import { Images, ImagesError } from "../endpoints/Images.js";
import { Networks, NetworksError } from "../endpoints/Networks.js";
import { Volumes, VolumesError } from "../endpoints/Volumes.js";
import { JSONMessage } from "../generated/index.js";
import { DockerLayer } from "./Docker.js";

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

    readonly build: (
        project: unknown,
        options: {}
    ) => Effect.Effect<
        Record<string, Stream.Stream<JSONMessage, ImagesError, never>>,
        ImagesError,
        FileSystem.FileSystem
    >;

    readonly pull: (
        project: unknown,
        options: {}
    ) => Effect.Effect<Record<string, Stream.Stream<JSONMessage, ImagesError, never>>, ImagesError, never>;

    readonly up: (
        project: unknown,
        options: {}
    ) => Effect.Effect<Record<string, string>, ContainersError | VolumesError | NetworksError, never>;

    readonly down: (project: unknown, options: {}) => Effect.Effect<Record<string, string>, ContainersError, never>;

    readonly rm: (
        project: unknown,
        options: {}
    ) => Effect.Effect<Record<string, string>, ContainersError | VolumesError | NetworksError, never>;

    readonly kill: (project: unknown, options: {}) => Effect.Effect<Record<string, string>, ContainersError, never>;

    readonly forProject: (project: unknown) => DockerComposeProject;
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
 * @category Layers
 */
export const layer: Layer.Layer<DockerCompose, never, Layer.Layer.Success<DockerLayer>> = Layer.effect(
    DockerCompose,
    Effect.gen(function* () {
        const images = yield* Images;
        const volumes = yield* Volumes;
        const networks = yield* Networks;
        const containers = yield* Containers;

        return DockerCompose.of({});
    })
);

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

    readonly build: (options: {}) => Effect.Effect<
        Record<string, Stream.Stream<JSONMessage, ImagesError, never>>,
        ImagesError,
        never
    >;

    readonly up: (options: {}) => Effect.Effect<
        Record<string, string>,
        ContainersError | VolumesError | NetworksError,
        never
    >;

    readonly down: (options: {}) => Effect.Effect<Record<string, string>, ContainersError, never>;

    readonly rm: (options: {}) => Effect.Effect<
        Record<string, string>,
        ContainersError | VolumesError | NetworksError,
        void
    >;
}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerProject: (
    project: string,
    tagIdentifier: string
) => {
    readonly tag: Context.Tag<DockerComposeProject, DockerComposeProject>;
    readonly layer: Layer.Layer<DockerComposeProject, never, DockerCompose>;
} = (project: unknown, tagIdentifier: string) => {
    const tag = Context.GenericTag<DockerComposeProject>(tagIdentifier);
    const effect = Effect.map(DockerCompose, ({ forProject }) => forProject(project));
    const layer = Layer.effect(tag, effect);
    return { tag, layer } as const;
};
