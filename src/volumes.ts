import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";

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

export class VolumeCreateError extends Data.TaggedError("VolumeCreateError")<{ message: string }> {}
export class VolumeDeleteError extends Data.TaggedError("VolumeDeleteError")<{ message: string }> {}
export class VolumeInspectError extends Data.TaggedError("VolumeInspectError")<{ message: string }> {}
export class VolumeListError extends Data.TaggedError("VolumeListError")<{ message: string }> {}
export class VolumePruneError extends Data.TaggedError("VolumePruneError")<{ message: string }> {}
export class VolumeUpdateError extends Data.TaggedError("VolumeUpdateError")<{ message: string }> {}

export interface VolumeDeleteOptions {
    /** Volume name or ID */
    name: string;
    /** Force the removal of the volume */
    force?: boolean;
}

export interface VolumeInspectOptions {
    /** Volume name or ID */
    name: string;
}

export interface VolumeListOptions {
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

export interface VolumePruneOptions {
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

export interface VolumeUpdateOptions {
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
 * @param options - Volume configuration
 */
export const volumeCreate = (
    options: VolumeCreateOptions
): Effect.Effect<IMobyConnectionAgent, VolumeCreateError, Readonly<Volume>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options, "VolumeCreateOptions"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeSchema)))
            .pipe(responseErrorHandler(VolumeCreateError));
    }).pipe(Effect.flatten);

/**
 * Instruct the driver to remove the volume.
 *
 * @param name - Volume name or ID
 * @param force - Force the removal of the volume
 */
export const volumeDelete = (
    options: VolumeDeleteOptions
): Effect.Effect<IMobyConnectionAgent, VolumeDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(VolumeDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a volume
 *
 * @param name - Volume name or ID
 */
export const volumeInspect = (
    options: VolumeInspectOptions
): Effect.Effect<IMobyConnectionAgent, VolumeInspectError, Readonly<Volume>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeSchema)))
            .pipe(responseErrorHandler(VolumeInspectError));
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
    options?: VolumeListOptions | undefined
): Effect.Effect<IMobyConnectionAgent, VolumeListError, Readonly<VolumeListResponse>> =>
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
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("filters", options?.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeListResponseSchema)))
            .pipe(responseErrorHandler(VolumeListError));
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
    options?: VolumePruneOptions | undefined
): Effect.Effect<IMobyConnectionAgent, VolumePruneError, Readonly<VolumePruneResponse>> =>
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
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("filters", options?.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumePruneResponseSchema)))
            .pipe(responseErrorHandler(VolumePruneError));
    }).pipe(Effect.flatten);

/**
 * Update a volume. Valid only for Swarm cluster volumes
 *
 * @param name - The name or ID of the volume
 * @param version - The version number of the volume being updated. This is
 *   required to avoid conflicting writes. Found in the volume's `ClusterVolume`
 *   field.
 * @param body - The spec of the volume to update. Currently, only Availability
 *   may change. All other fields must remain unchanged.
 */
export const volumeUpdate = (
    options: VolumeUpdateOptions
): Effect.Effect<IMobyConnectionAgent, VolumeUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "PUT";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "VolumesNameBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(VolumeUpdateError));
    }).pipe(Effect.flatten);

export interface IVolumeService {
    Errors:
        | VolumeCreateError
        | VolumeDeleteError
        | VolumeInspectError
        | VolumeListError
        | VolumePruneError
        | VolumeUpdateError;

    /**
     * Create a volume
     *
     * @param options - Volume configuration
     */
    volumeCreate: WithConnectionAgentProvided<typeof volumeCreate>;

    /**
     * Instruct the driver to remove the volume.
     *
     * @param name - Volume name or ID
     * @param force - Force the removal of the volume
     */
    volumeDelete: WithConnectionAgentProvided<typeof volumeDelete>;

    /**
     * Inspect a volume
     *
     * @param name - Volume name or ID
     */
    volumeInspect: WithConnectionAgentProvided<typeof volumeInspect>;

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
     *       returned:
     *   - `driver=<volume-driver-name>` Matches volumes based on their driver:
     *   - `label=<key>` or `label=<key>:<value>` Matches volumes based on the
     *       presence of a `label` alone or a `label` and a value:
     *   - `name=<volume-name>` Matches all or part of a volume name.
     */
    volumeList: WithConnectionAgentProvided<typeof volumeList>;

    /**
     * Delete unused volumes
     *
     * @param filters - Filters to process on the prune list, encoded as JSON (a
     *   `map[string][]string`). Available filters:
     *
     *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *       `label!=<key>=<value>`) Prune volumes with (or without, in case
     *       `label!=...` is used) the specified labels:
     *   - `all` (`all=true`) - Consider all (local) volumes for pruning and not
     *       just anonymous volumes.
     */
    volumePrune: WithConnectionAgentProvided<typeof volumePrune>;

    /**
     * Update a volume. Valid only for Swarm cluster volumes
     *
     * @param name - The name or ID of the volume
     * @param version - The version number of the volume being updated. This is
     *   required to avoid conflicting writes. Found in the volume's
     *   `ClusterVolume` field.
     * @param body - The spec of the volume to update. Currently, only
     *   Availability may change. All other fields must remain unchanged.
     */
    volumeUpdate: WithConnectionAgentProvided<typeof volumeUpdate>;
}
