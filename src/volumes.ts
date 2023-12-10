import * as NodeHttp from "@effect/platform-node/HttpClient";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, errorHandler, setBody } from "./request-helpers.js";

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
): Effect.Effect<IMobyConnectionAgent, VolumeCreateError, Readonly<Volume>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new VolumeCreateError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/volumes/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "VolumeCreateOptions"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeSchema)))
            .pipe(errorHandler(VolumeCreateError));
    }).pipe(Effect.flatten);

/**
 * Instruct the driver to remove the volume.
 *
 * @param name - Volume name or ID
 * @param force - Force the removal of the volume
 */
export const volumeDelete = (
    options: volumeDeleteOptions
): Effect.Effect<IMobyConnectionAgent, VolumeDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new VolumeDeleteError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(VolumeDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a volume
 *
 * @param name - Volume name or ID
 */
export const volumeInspect = (
    options: volumeInspectOptions
): Effect.Effect<IMobyConnectionAgent, VolumeInspectError, Readonly<Volume>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new VolumeInspectError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeSchema)))
            .pipe(errorHandler(VolumeInspectError));
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
): Effect.Effect<IMobyConnectionAgent, VolumeListError, Readonly<VolumeListResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumeListResponseSchema)))
            .pipe(errorHandler(VolumeListError));
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
): Effect.Effect<IMobyConnectionAgent, VolumePruneError, Readonly<VolumePruneResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/volumes/prune";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(VolumePruneResponseSchema)))
            .pipe(errorHandler(VolumePruneError));
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
): Effect.Effect<IMobyConnectionAgent, VolumeUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new VolumeUpdateError({ message: "Required parameter name was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new VolumeUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/volumes/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "PUT";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "VolumesNameBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(VolumeUpdateError));
    }).pipe(Effect.flatten);

export interface IVolumeService {
    /**
     * Create a volume
     *
     * @param body - Volume configuration
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
     * "Update a volume. Valid only for Swarm cluster volumes"
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
