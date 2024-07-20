/**
 * Volumes service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";

import {
    ClusterVolumeSpec,
    Volume,
    VolumeCreateOptions,
    VolumeListResponse,
    VolumePruneResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const VolumesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/VolumesError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type VolumesErrorTypeId = typeof VolumesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isVolumesError = (u: unknown): u is VolumesError => Predicate.hasProperty(u, VolumesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class VolumesError extends PlatformError.TypeIdError(VolumesErrorTypeId, "VolumesError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
    }
}

/** @since 1.0.0 */
export interface VolumeListOptions {
    /**
     * JSON encoded value of the filters (a `map[string][]string`) to process on
     * the volumes list. Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes
     *   that are not in use by a container. When set to `false` (or `0`), only
     *   volumes that are in use by one or more containers are returned.
     * - `driver=<volume-driver-name>` Matches volumes based on their driver.
     * - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
     *   presence of a `label` alone or a `label` and a value.
     * - `name=<volume-name>` Matches all or part of a volume name.
     */
    readonly filters?: {
        name?: [string] | undefined;
        driver?: [string] | undefined;
        label?: Array<string> | undefined;
        dangling?: ["true" | "false" | "1" | "0"] | undefined;
    };
}

/** @since 1.0.0 */
export interface VolumeDeleteOptions {
    /** Volume name or ID */
    readonly name: string;
    /** Force the removal of the volume */
    readonly force?: boolean | undefined;
}

/** @since 1.0.0 */
export interface VolumeInspectOptions {
    /** Volume name or ID */
    readonly name: string;
}

/** @since 1.0.0 */
export interface VolumeUpdateOptions {
    /** The name or ID of the volume */
    readonly name: string;
    /**
     * The spec of the volume to update. Currently, only Availability may
     * change. All other fields must remain unchanged.
     */
    readonly spec: ClusterVolumeSpec;
    /**
     * The version number of the volume being updated. This is required to avoid
     * conflicting writes. Found in the volume's `ClusterVolume` field.
     */
    readonly version: number;
}

/** @since 1.0.0 */
export interface VolumePruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`).
     *
     * Available filters:
     *
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune volumes with (or without, in case
     *   `label!=...` is used) the specified labels.
     * - `all` (`all=true`) - Consider all (local) volumes for pruning and not
     *   just anonymous volumes.
     */
    readonly filters?: { label?: Array<string> | undefined; all?: ["true" | "false" | "1" | "0"] | undefined };
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface VolumesImpl {
    /**
     * List volumes
     *
     * @param filters - JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the volumes list. Available
     *   filters:
     *
     *   - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes
     *       that are not in use by a container. When set to `false` (or `0`),
     *       only volumes that are in use by one or more containers are
     *       returned.
     *   - `driver=<volume-driver-name>` Matches volumes based on their driver.
     *   - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
     *       presence of a `label` alone or a `label` and a value.
     *   - `name=<volume-name>` Matches all or part of a volume name.
     */
    readonly list: (options?: VolumeListOptions | undefined) => Effect.Effect<VolumeListResponse, VolumesError, never>;

    /**
     * Create a volume
     *
     * @param volumeConfig - Volume configuration
     */
    readonly create: (options: VolumeCreateOptions) => Effect.Effect<Readonly<Volume>, VolumesError, never>;

    /**
     * Remove a volume
     *
     * @param name - Volume name or ID
     * @param force - Force the removal of the volume
     */
    readonly delete: (options: VolumeDeleteOptions) => Effect.Effect<void, VolumesError, never>;

    /**
     * Inspect a volume
     *
     * @param name - Volume name or ID
     */
    readonly inspect: (options: VolumeInspectOptions) => Effect.Effect<Readonly<Volume>, VolumesError, never>;

    /**
     * "Update a volume. Valid only for Swarm cluster volumes"
     *
     * @param name - The name or ID of the volume
     * @param spec - The spec of the volume to update. Currently, only
     *   Availability may change. All other fields must remain unchanged.
     * @param version - The version number of the volume being updated. This is
     *   required to avoid conflicting writes. Found in the volume's
     *   `ClusterVolume` field.
     */
    readonly update: (options: VolumeUpdateOptions) => Effect.Effect<void, VolumesError, never>;

    /**
     * Delete unused volumes
     *
     * Available filters:
     *
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune volumes with (or without, in case
     *   `label!=...` is used) the specified labels.
     * - `all` (`all=true`) - Consider all (local) volumes for pruning and not
     *   just anonymous volumes.
     */
    readonly prune: (options: VolumePruneOptions) => Effect.Effect<VolumePruneResponse, VolumesError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<VolumesImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/volumes")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const VolumeClient = client.pipe(HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(Volume)));
    const VolumeListResponseClient = client.pipe(
        HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(VolumeListResponse))
    );
    const VolumePruneResponseClient = client.pipe(
        HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(VolumePruneResponse))
    );

    const list_ = (options?: VolumeListOptions | undefined): Effect.Effect<VolumeListResponse, VolumesError> =>
        Function.pipe(
            HttpClientRequest.get(""),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            VolumeListResponseClient,
            Effect.mapError((cause) => new VolumesError({ method: "list", cause }))
        );

    const create_ = (options: VolumeCreateOptions): Effect.Effect<Readonly<Volume>, VolumesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/create"),
            HttpClientRequest.schemaBody(VolumeCreateOptions)(options),
            Effect.flatMap(VolumeClient),
            Effect.mapError((cause) => new VolumesError({ method: "create", cause }))
        );

    const delete_ = (options: VolumeDeleteOptions): Effect.Effect<void, VolumesError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/${encodeURIComponent(options.name)}`),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            voidClient,
            Effect.mapError((cause) => new VolumesError({ method: "delete", cause })),
            Effect.scoped
        );

    const inspect_ = (options: VolumeInspectOptions): Effect.Effect<Readonly<Volume>, VolumesError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.name)}`),
            VolumeClient,
            Effect.mapError((cause) => new VolumesError({ method: "inspect", cause }))
        );

    const update_ = (options: VolumeUpdateOptions): Effect.Effect<void, VolumesError, never> =>
        Function.pipe(
            HttpClientRequest.put(`/${encodeURIComponent(options.name)}`),
            maybeAddQueryParameter("version", Option.some(options.version)),
            HttpClientRequest.schemaBody(ClusterVolumeSpec)(options.spec),
            Effect.flatMap(voidClient),
            Effect.mapError((cause) => new VolumesError({ method: "update", cause })),
            Effect.scoped
        );

    const prune_ = (
        options?: VolumePruneOptions | undefined
    ): Effect.Effect<VolumePruneResponse, VolumesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/prune"),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            VolumePruneResponseClient,
            Effect.mapError((cause) => new VolumesError({ method: "prune", cause }))
        );

    return {
        list: list_,
        create: create_,
        delete: delete_,
        inspect: inspect_,
        update: update_,
        prune: prune_,
    };
});

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Volumes {
    readonly _: unique symbol;
}

/**
 * Volumes service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Volumes: Context.Tag<Volumes, VolumesImpl> = Context.GenericTag<Volumes, VolumesImpl>(
    "@the-moby-effect/moby/Volumes"
);

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Volumes, never, HttpClient.HttpClient.Default> = Layer.effect(Volumes, make);
