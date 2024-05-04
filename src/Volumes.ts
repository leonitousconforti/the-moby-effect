import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import { ClusterVolumeSpec, Volume, VolumeCreateOptions, VolumeListResponse, VolumePruneResponse } from "./schemas.js";

export class VolumesError extends Data.TaggedError("VolumesError")<{
    method: string;
    message: string;
}> {}

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
        label?: string[] | undefined;
        name?: [string] | undefined;
        driver?: [string] | undefined;
        dangling?: ["true" | "false" | "1" | "0"] | undefined;
    };
}

export interface VolumeDeleteOptions {
    /** Volume name or ID */
    readonly name: string;
    /** Force the removal of the volume */
    readonly force?: boolean;
}

export interface VolumeInspectOptions {
    /** Volume name or ID */
    readonly name: string;
}

export interface VolumeUpdateOptions {
    /** The name or ID of the volume */
    readonly name: string;
    /**
     * The spec of the volume to update. Currently, only Availability may
     * change. All other fields must remain unchanged.
     */
    readonly spec: Schema.Schema.To<typeof ClusterVolumeSpec.struct>;
    /**
     * The version number of the volume being updated. This is required to avoid
     * conflicting writes. Found in the volume's `ClusterVolume` field.
     */
    readonly version: number;
}

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
    readonly filters?: { label?: string[] | undefined; all?: ["true" | "false" | "1" | "0"] | undefined };
}

export interface Volumes {
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
    readonly list: (options?: VolumeListOptions | undefined) => Effect.Effect<VolumeListResponse, VolumesError>;

    /**
     * Create a volume
     *
     * @param volumeConfig - Volume configuration
     */
    readonly create: (
        options: Schema.Schema.To<typeof VolumeCreateOptions.struct>
    ) => Effect.Effect<Readonly<Volume>, VolumesError>;

    /**
     * Remove a volume
     *
     * @param name - Volume name or ID
     * @param force - Force the removal of the volume
     */
    readonly delete: (options: VolumeDeleteOptions) => Effect.Effect<void, VolumesError>;

    /**
     * Inspect a volume
     *
     * @param name - Volume name or ID
     */
    readonly inspect: (options: VolumeInspectOptions) => Effect.Effect<Readonly<Volume>, VolumesError>;

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
    readonly update: (options: VolumeUpdateOptions) => Effect.Effect<void, VolumesError>;

    /**
     * Delete unused volumes
     *
     * @param filters - Filters to process on the prune list, encoded as JSON (a
     *   `map[string][]string`).
     *
     *   Available filters:
     *
     *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *       `label!=<key>=<value>`) Prune volumes with (or without, in case
     *       `label!=...` is used) the specified labels.
     *   - `all` (`all=true`) - Consider all (local) volumes for pruning and not
     *       just anonymous volumes.
     */
    readonly prune: (options: VolumePruneOptions) => Effect.Effect<VolumePruneResponse, VolumesError>;
}

const make: Effect.Effect<Volumes, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/volumes`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asUnit));
        const VolumeClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Volume)));
        const VolumeListResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(VolumeListResponse))
        );
        const VolumePruneResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(VolumePruneResponse))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new VolumesError({ method, message }));

        const list_ = (options: VolumeListOptions | undefined): Effect.Effect<VolumeListResponse, VolumesError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                VolumeListResponseClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const create_ = (
            options: Schema.Schema.To<typeof VolumeCreateOptions.struct>
        ): Effect.Effect<Readonly<Volume>, VolumesError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                HttpClient.request.schemaBody(VolumeCreateOptions)(new VolumeCreateOptions(options)),
                Effect.flatMap(VolumeClient),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const delete_ = (options: VolumeDeleteOptions): Effect.Effect<void, VolumesError> =>
            Function.pipe(
                HttpClient.request.del("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const inspect_ = (options: VolumeInspectOptions): Effect.Effect<Readonly<Volume>, VolumesError> =>
            Function.pipe(
                HttpClient.request.get("/{name}".replace("{name}", encodeURIComponent(options.name))),
                VolumeClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const update_ = (options: VolumeUpdateOptions): Effect.Effect<void, VolumesError> =>
            Function.pipe(
                HttpClient.request.put("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("version", options.version),
                HttpClient.request.schemaBody(ClusterVolumeSpec)(new ClusterVolumeSpec(options.spec)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        const prune_ = (options: VolumePruneOptions | undefined): Effect.Effect<VolumePruneResponse, VolumesError> =>
            Function.pipe(
                HttpClient.request.post("/prune"),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                VolumePruneResponseClient,
                Effect.catchAll(responseHandler("prune")),
                Effect.scoped
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_, prune: prune_ };
    }
);

export const Volumes = Context.GenericTag<Volumes>("the-moby-effect/Volumes");
export const layer = Layer.effect(Volumes, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
