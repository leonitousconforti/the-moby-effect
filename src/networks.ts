import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, errorHandler, setBody } from "./request-helpers.js";

import {
    Network,
    NetworkConnectRequest,
    NetworkCreateRequest,
    NetworkCreateResponse,
    NetworkCreateResponseSchema,
    NetworkDisconnectRequest,
    NetworkPruneResponse,
    NetworkPruneResponseSchema,
    NetworkSchema,
} from "./schemas.js";

export class NetworkConnectError extends Data.TaggedError("NetworkConnectError")<{ message: string }> {}
export class NetworkCreateError extends Data.TaggedError("NetworkCreateError")<{ message: string }> {}
export class NetworkDeleteError extends Data.TaggedError("NetworkDeleteError")<{ message: string }> {}
export class NetworkDisconnectError extends Data.TaggedError("NetworkDisconnectError")<{ message: string }> {}
export class NetworkInspectError extends Data.TaggedError("NetworkInspectError")<{ message: string }> {}
export class NetworkListError extends Data.TaggedError("NetworkListError")<{ message: string }> {}
export class NetworkPruneError extends Data.TaggedError("NetworkPruneError")<{ message: string }> {}

export interface networkConnectOptions {
    body: NetworkConnectRequest;
    /** Network ID or name */
    id: string;
}

export interface networkCreateOptions {
    /** Network configuration */
    body: NetworkCreateRequest;
}

export interface networkDeleteOptions {
    /** Network ID or name */
    id: string;
}

export interface networkDisconnectOptions {
    body: NetworkDisconnectRequest;
    /** Network ID or name */
    id: string;
}

export interface networkInspectOptions {
    /** Network ID or name */
    id: string;
    /** Detailed inspect output for troubleshooting */
    verbose?: boolean;
    /** Filter the network by scope (swarm, global, or local) */
    scope?: string;
}

export interface networkListOptions {
    /**
     * JSON encoded value of the filters (a `map[string][]string`) to process on
     * the networks list. Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
     *   that are not in use by a container. When set to `false` (or `0`), only
     *   networks that are in use by one or more containers are returned.
     * - `driver=<driver-name>` Matches a network's driver.
     * - `id=<network-id>` Matches all or part of a network ID.
     * - `label=<key>` or `label=<key>=<value>` of a network label.
     * - `name=<network-name>` Matches all or part of a network name.
     * - `scope=[\"swarm\"|\"global\"|\"local\"]` Filters networks by scope
     *   (`swarm`, `global`, or `local`).
     * - `type=[\"custom\"|\"builtin\"]` Filters networks by type. The `custom`
     *   keyword returns all user-defined networks.
     */
    filters?: string;
}

export interface networkPruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`). Available filters:
     *
     * - `until=<timestamp>` Prune networks created before this timestamp. The
     *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
     *   duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
     *   machine’s time.
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune networks with (or without, in case
     *   `label!=...` is used) the specified labels.
     */
    filters?: string;
}

/**
 * Connect a container to a network
 *
 * @param body -
 * @param id - Network ID or name
 */
export const networkConnect = (
    options: networkConnectOptions
): Effect.Effect<IMobyConnectionAgent, NetworkConnectError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new NetworkConnectError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.id === null || options.id === undefined) {
            yield* _(new NetworkConnectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/networks/{id}/connect";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "NetworkConnectRequest"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(NetworkConnectError));
    }).pipe(Effect.flatten);

/**
 * Create a network
 *
 * @param body - Network configuration
 */
export const networkCreate = (
    options: networkCreateOptions
): Effect.Effect<IMobyConnectionAgent, NetworkCreateError, Readonly<NetworkCreateResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new NetworkCreateError({ message: "Required parameter body was null or undefined" }));
        }

        const endpoint: string = "/networks/create";
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
            .pipe(setBody(options.body, "NetworkCreateRequest"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(NetworkCreateResponseSchema)))
            .pipe(errorHandler(NetworkCreateError));
    }).pipe(Effect.flatten);

/**
 * Remove a network
 *
 * @param id - Network ID or name
 */
export const networkDelete = (
    options: networkDeleteOptions
): Effect.Effect<IMobyConnectionAgent, NetworkDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new NetworkDeleteError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/networks/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(NetworkDeleteError));
    }).pipe(Effect.flatten);

/**
 * Disconnect a container from a network
 *
 * @param body -
 * @param id - Network ID or name
 */
export const networkDisconnect = (
    options: networkDisconnectOptions
): Effect.Effect<IMobyConnectionAgent, NetworkDisconnectError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.body === null || options.body === undefined) {
            yield* _(new NetworkDisconnectError({ message: "Required parameter body was null or undefined" }));
        }

        if (options.id === null || options.id === undefined) {
            yield* _(new NetworkDisconnectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/networks/{id}/disconnect";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "NetworkDisconnectRequest"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(NetworkDisconnectError));
    }).pipe(Effect.flatten);

/**
 * Inspect a network
 *
 * @param id - Network ID or name
 * @param verbose - Detailed inspect output for troubleshooting
 * @param scope - Filter the network by scope (swarm, global, or local)
 */
export const networkInspect = (
    options: networkInspectOptions
): Effect.Effect<IMobyConnectionAgent, NetworkInspectError, Readonly<Network>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new NetworkInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/networks/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("verbose", options.verbose))
            .pipe(addQueryParameter("scope", options.scope))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(NetworkSchema)))
            .pipe(errorHandler(NetworkInspectError));
    }).pipe(Effect.flatten);

/**
 * Returns a list of networks. For details on the format, see the [network
 * inspect endpoint](#operation/NetworkInspect). Note that it uses a different,
 * smaller representation of a network than inspecting a single network. For
 * example, the list of containers attached to the network is not propagated in
 * API versions 1.28 and up.
 *
 * @param filters - JSON encoded value of the filters (a `map[string][]string`)
 *   to process on the networks list. Available filters:
 *
 *   - `dangling=<boolean>` When set to `true` (or `1`), returns all networks that
 *       are not in use by a container. When set to `false` (or `0`), only
 *       networks that are in use by one or more containers are returned.
 *   - `driver=<driver-name>` Matches a network's driver.
 *   - `id=<network-id>` Matches all or part of a network ID.
 *   - `label=<key>` or `label=<key>=<value>` of a network label.
 *   - `name=<network-name>` Matches all or part of a network name.
 *   - `scope=[\"swarm\"|\"global\"|\"local\"]` Filters networks by scope (`swarm`,
 *       `global`, or `local`).
 *   - `type=[\"custom\"|\"builtin\"]` Filters networks by type. The `custom`
 *       keyword returns all user-defined networks.
 */
export const networkList = (
    options: networkListOptions
): Effect.Effect<IMobyConnectionAgent, NetworkListError, Readonly<Array<Network>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/networks";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(NetworkSchema))))
            .pipe(errorHandler(NetworkListError));
    }).pipe(Effect.flatten);

/**
 * Delete unused networks
 *
 * @param filters - Filters to process on the prune list, encoded as JSON (a
 *   `map[string][]string`). Available filters:
 *
 *   - `until=<timestamp>` Prune networks created before this timestamp. The
 *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
 *       duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
 *       machine’s time.
 *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
 *       `label!=<key>=<value>`) Prune networks with (or without, in case
 *       `label!=...` is used) the specified labels.
 */
export const networkPrune = (
    options: networkPruneOptions
): Effect.Effect<IMobyConnectionAgent, NetworkPruneError, Readonly<NetworkPruneResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/networks/prune";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(NetworkPruneResponseSchema)))
            .pipe(errorHandler(NetworkPruneError));
    }).pipe(Effect.flatten);

export interface INetworkService {
    /**
     * Connect a container to a network
     *
     * @param body -
     * @param id - Network ID or name
     */
    networkConnect: WithConnectionAgentProvided<typeof networkConnect>;

    /**
     * Create a network
     *
     * @param body - Network configuration
     */
    networkCreate: WithConnectionAgentProvided<typeof networkCreate>;

    /**
     * Remove a network
     *
     * @param id - Network ID or name
     */
    networkDelete: WithConnectionAgentProvided<typeof networkDelete>;

    /**
     * Disconnect a container from a network
     *
     * @param body -
     * @param id - Network ID or name
     */
    networkDisconnect: WithConnectionAgentProvided<typeof networkDisconnect>;

    /**
     * Inspect a network
     *
     * @param id - Network ID or name
     * @param verbose - Detailed inspect output for troubleshooting
     * @param scope - Filter the network by scope (swarm, global, or local)
     */
    networkInspect: WithConnectionAgentProvided<typeof networkInspect>;

    /**
     * Returns a list of networks. For details on the format, see the [network
     * inspect endpoint](#operation/NetworkInspect). Note that it uses a
     * different, smaller representation of a network than inspecting a single
     * network. For example, the list of containers attached to the network is
     * not propagated in API versions 1.28 and up.
     *
     * @param filters - JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the networks list. Available
     *   filters:
     *
     *   - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
     *       that are not in use by a container. When set to `false` (or `0`),
     *       only networks that are in use by one or more containers are
     *       returned.
     *   - `driver=<driver-name>` Matches a network's driver.
     *   - `id=<network-id>` Matches all or part of a network ID.
     *   - `label=<key>` or `label=<key>=<value>` of a network label.
     *   - `name=<network-name>` Matches all or part of a network name.
     *   - `scope=[\"swarm\"|\"global\"|\"local\"]` Filters networks by scope
     *       (`swarm`, `global`, or `local`).
     *   - `type=[\"custom\"|\"builtin\"]` Filters networks by type. The `custom`
     *       keyword returns all user-defined networks.
     */
    networkList: WithConnectionAgentProvided<typeof networkList>;

    /**
     * Delete unused networks
     *
     * @param filters - Filters to process on the prune list, encoded as JSON (a
     *   `map[string][]string`). Available filters:
     *
     *   - `until=<timestamp>` Prune networks created before this timestamp. The
     *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
     *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
     *       daemon machine’s time.
     *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *       `label!=<key>=<value>`) Prune networks with (or without, in case
     *       `label!=...` is used) the specified labels.
     */
    networkPrune: WithConnectionAgentProvided<typeof networkPrune>;
}
