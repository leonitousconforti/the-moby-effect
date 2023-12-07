import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    WithConnectionAgentProvided,
    addHeader,
    addQueryParameter,
    errorHandler,
    setBody,
} from "./request-helpers.js";

import {
    Volume,
    VolumeCreateOptions,
    VolumeListResponse,
    VolumeListResponseSchema,
    VolumePruneResponse,
    VolumePruneResponseSchema,
    VolumeSchema,
    VolumesNameBody,
} from "./schemas.js";

export class volumeCreateError extends Data.TaggedError("volumeCreateError")<{ message: string }> {}
export class volumeDeleteError extends Data.TaggedError("volumeDeleteError")<{ message: string }> {}
export class volumeInspectError extends Data.TaggedError("volumeInspectError")<{ message: string }> {}
export class volumeListError extends Data.TaggedError("volumeListError")<{ message: string }> {}
export class volumePruneError extends Data.TaggedError("volumePruneError")<{ message: string }> {}
export class volumeUpdateError extends Data.TaggedError("volumeUpdateError")<{ message: string }> {}

export interface volumeCreateOptions {
    /** Volume configuration */
    body: VolumeCreateOptions;
}

export interface volumeDeleteOptions {
    /** Volume name or ID */
    name: string;
    /** Force the removal of the volume */
    force?: boolean;
}

export interface volumeInspectOptions {
    /** Volume name or ID */
    name: string;
}

export interface volumeListOptions {
    /**
     * JSON encoded value of the filters (a `map[string][]string`) to process on
     * the volumes list. Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes
     *   that are not in use by a container. When set to `false` (or `0`), only
     *   volumes that are in use by one or more containers are returned:
     * - `driver=<volume-driver-name>` Matches volumes based on their driver:
     * - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
     *   presence of a `label` alone or a `label` and a value:
     * - `name=<volume-name>` Matches all or part of a volume name.
     */
    filters?: string;
}

export interface volumePruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`). Available filters:
     *
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune volumes with (or without, in case
     *   `label!=...` is used) the specified labels:
     * - `all` (`all=true`) - Consider all (local) volumes for pruning and not
     *   just anonymous volumes.
     */
    filters?: string;
}

export interface volumeUpdateOptions {
    /** The name or ID of the volume */
    name: string;
    /**
     * The version number of the volume being updated. This is required to avoid
     * conflicting writes. Found in the volume's `ClusterVolume` field.
     */
    version: number;
    /**
     * The spec of the volume to update. Currently, only Availability may
     * change. All other fields must remain unchanged.
     */
    body?: VolumesNameBody;
}

/**
 * Create a volume
 *
 * @param body - Volume configuration
 */
export const volumeCreate = (
    options: volumeCreateOptions
): Effect.Effect<IMobyConnectionAgent, volumeCreateError, Readonly<Volume>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new volumeCreateError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/volumes/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "VolumeCreateOptions"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeSchema)))
            .pipe(errorHandler(volumeCreateError));
    }).pipe(Effect.flatten);

/**
 * Instruct the driver to remove the volume.
 *
 * @param name - Volume name or ID
 * @param force - Force the removal of the volume
 */
export const volumeDelete = (
    options: volumeDeleteOptions
): Effect.Effect<IMobyConnectionAgent, volumeDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new volumeDeleteError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(volumeDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a volume
 *
 * @param name - Volume name or ID
 */
export const volumeInspect = (
    options: volumeInspectOptions
): Effect.Effect<IMobyConnectionAgent, volumeInspectError, Readonly<Volume>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new volumeInspectError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeSchema)))
            .pipe(errorHandler(volumeInspectError));
    }).pipe(Effect.flatten);

/**
 * List volumes
 *
 * @param filters - JSON encoded value of the filters (a `map[string][]string`)
 *   to process on the volumes list. Available filters:
 *
 *   - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes that
 *       are not in use by a container. When set to `false` (or `0`), only
 *       volumes that are in use by one or more containers are returned:
 *   - `driver=<volume-driver-name>` Matches volumes based on their driver:
 *   - `label=<key>` or `label=<key>:<value>` Matches volumes based on the presence
 *       of a `label` alone or a `label` and a value:
 *   - `name=<volume-name>` Matches all or part of a volume name.
 */
export const volumeList = (
    options: volumeListOptions
): Effect.Effect<IMobyConnectionAgent, volumeListError, Readonly<VolumeListResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeListResponseSchema)))
            .pipe(errorHandler(volumeListError));
    }).pipe(Effect.flatten);

/**
 * Delete unused volumes
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters:
 *
 *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *       `label!=<key>=<value>`) Prune volumes with (or without, in case
 *       `label!=...` is used) the specified labels:
 *   - `all` (`all=true`) - Consider all (local) volumes for pruning and not just
 *       anonymous volumes.
 */
export const volumePrune = (
    options: volumePruneOptions
): Effect.Effect<IMobyConnectionAgent, volumePruneError, Readonly<VolumePruneResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes/prune";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumePruneResponseSchema)))
            .pipe(errorHandler(volumePruneError));
    }).pipe(Effect.flatten);

/**
 * "Update a volume. Valid only for Swarm cluster volumes"
 *
 * @param name - The name or ID of the volume
 * @param version - The version number of the volume being updated. This is
 *   required to avoid conflicting writes. Found in the volume's `ClusterVolume`
 *   field.
 * @param body - The spec of the volume to update. Currently, only Availability
 *   may change. All other fields must remain unchanged.
 */
export const volumeUpdate = (
    options: volumeUpdateOptions
): Effect.Effect<IMobyConnectionAgent, volumeUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new volumeUpdateError({ message: "Required parameter name was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new volumeUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "PUT";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "VolumesNameBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(volumeUpdateError));
    }).pipe(Effect.flatten);

/**
 * Create a volume
 *
 * @param body - Volume configuration
 */
export type volumeCreateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof volumeCreate>;

/**
 * Instruct the driver to remove the volume.
 *
 * @param name - Volume name or ID
 * @param force - Force the removal of the volume
 */
export type volumeDeleteWithConnectionAgentProvided = WithConnectionAgentProvided<typeof volumeDelete>;

/**
 * Inspect a volume
 *
 * @param name - Volume name or ID
 */
export type volumeInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof volumeInspect>;

/**
 * List volumes
 *
 * @param filters - JSON encoded value of the filters (a `map[string][]string`)
 *   to process on the volumes list. Available filters:
 *
 *   - `dangling=<boolean>` When set to `true` (or `1`), returns all volumes that
 *       are not in use by a container. When set to `false` (or `0`), only
 *       volumes that are in use by one or more containers are returned:
 *   - `driver=<volume-driver-name>` Matches volumes based on their driver:
 *   - `label=<key>` or `label=<key>:<value>` Matches volumes based on the presence
 *       of a `label` alone or a `label` and a value:
 *   - `name=<volume-name>` Matches all or part of a volume name.
 */
export type volumeListWithConnectionAgentProvided = WithConnectionAgentProvided<typeof volumeList>;

/**
 * Delete unused volumes
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters:
 *
 *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *       `label!=<key>=<value>`) Prune volumes with (or without, in case
 *       `label!=...` is used) the specified labels:
 *   - `all` (`all=true`) - Consider all (local) volumes for pruning and not just
 *       anonymous volumes.
 */
export type volumePruneWithConnectionAgentProvided = WithConnectionAgentProvided<typeof volumePrune>;

/**
 * "Update a volume. Valid only for Swarm cluster volumes"
 *
 * @param name - The name or ID of the volume
 * @param version - The version number of the volume being updated. This is
 *   required to avoid conflicting writes. Found in the volume's `ClusterVolume`
 *   field.
 * @param body - The spec of the volume to update. Currently, only Availability
 *   may change. All other fields must remain unchanged.
 */
export type volumeUpdateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof volumeUpdate>;
