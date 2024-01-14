import * as NodeHttp from "@effect/platform-node/HttpClient";
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
    readonly list: (options?: VolumeListOptions | undefined) => Effect.Effect<never, VolumesError, VolumeListResponse>;

    /**
     * Create a volume
     *
     * @param volumeConfig - Volume configuration
     */
    readonly create: (
        options: Schema.Schema.To<typeof VolumeCreateOptions.struct>
    ) => Effect.Effect<never, VolumesError, Readonly<Volume>>;

    /**
     * Remove a volume
     *
     * @param name - Volume name or ID
     * @param force - Force the removal of the volume
     */
    readonly delete: (options: VolumeDeleteOptions) => Effect.Effect<never, VolumesError, void>;

    /**
     * Inspect a volume
     *
     * @param name - Volume name or ID
     */
    readonly inspect: (options: VolumeInspectOptions) => Effect.Effect<never, VolumesError, Readonly<Volume>>;

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
    readonly update: (options: VolumeUpdateOptions) => Effect.Effect<never, VolumesError, void>;

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
    readonly prune: (options: VolumePruneOptions) => Effect.Effect<never, VolumesError, VolumePruneResponse>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Volumes> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/volumes`)),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        const VolumeClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Volume)));
        const VolumeListResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(VolumeListResponse))
        );
        const VolumePruneResponseClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(VolumePruneResponse))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new VolumesError({ method, message }));

        const list_ = (
            options: VolumeListOptions | undefined
        ): Effect.Effect<never, VolumesError, VolumeListResponse> =>
            Function.pipe(
                NodeHttp.request.get(""),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                VolumeListResponseClient,
                Effect.catchAll(responseHandler("list"))
            );

        const create_ = (
            options: Schema.Schema.To<typeof VolumeCreateOptions.struct>
        ): Effect.Effect<never, VolumesError, Readonly<Volume>> =>
            Function.pipe(
                NodeHttp.request.post("/create"),
                NodeHttp.request.schemaBody(VolumeCreateOptions)(new VolumeCreateOptions(options)),
                Effect.flatMap(VolumeClient),
                Effect.catchAll(responseHandler("create"))
            );

        const delete_ = (options: VolumeDeleteOptions): Effect.Effect<never, VolumesError, void> =>
            Function.pipe(
                NodeHttp.request.del("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                voidClient,
                Effect.catchAll(responseHandler("delete"))
            );

        const inspect_ = (options: VolumeInspectOptions): Effect.Effect<never, VolumesError, Readonly<Volume>> =>
            Function.pipe(
                NodeHttp.request.get("/{name}".replace("{name}", encodeURIComponent(options.name))),
                VolumeClient,
                Effect.catchAll(responseHandler("inspect"))
            );

        const update_ = (options: VolumeUpdateOptions): Effect.Effect<never, VolumesError, void> =>
            Function.pipe(
                NodeHttp.request.put("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("version", options.version),
                NodeHttp.request.schemaBody(ClusterVolumeSpec)(new ClusterVolumeSpec(options.spec)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update"))
            );

        const prune_ = (
            options: VolumePruneOptions | undefined
        ): Effect.Effect<never, VolumesError, VolumePruneResponse> =>
            Function.pipe(
                NodeHttp.request.post("/prune"),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                VolumePruneResponseClient,
                Effect.catchAll(responseHandler("prune"))
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_, prune: prune_ };
    }
);

export const Volumes = Context.Tag<Volumes>("the-moby-effect/Volumes");
export const layer = Layer.effect(Volumes, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
