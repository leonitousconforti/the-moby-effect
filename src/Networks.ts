/**
 * Networks service
 *
 * @since 1.0.0
 */

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
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { addQueryParameter, responseErrorHandler } from "./Requests.js";
import {
    Network,
    NetworkConnectRequest,
    NetworkCreateRequest,
    NetworkCreateResponse,
    NetworkDisconnectRequest,
    NetworkPruneResponse,
} from "./Schemas.js";

export class NetworksError extends Data.TaggedError("NetworksError")<{
    method: string;
    message: string;
}> {}

export interface NetworkListOptions {
    /**
     * JSON encoded value of the filters (a `map[string][]string`) to process on
     * the networks list.
     *
     * Available filters:
     *
     * - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
     *   that are not in use by a container. When set to `false` (or `0`), only
     *   networks that are in use by one or more containers are returned.
     * - `driver=<driver-name>` Matches a network's driver.
     * - `id=<network-id>` Matches all or part of a network ID.
     * - `label=<key>` or `label=<key>=<value>` of a network label.
     * - `name=<network-name>` Matches all or part of a network name.
     * - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`,
     *   `global`, or `local`).
     * - `type=["custom"|"builtin"]` Filters networks by type. The `custom`
     *   keyword returns all user-defined networks.
     */
    readonly filters?: string;
}

export interface NetworkDeleteOptions {
    /** Network ID or name */
    readonly id: string;
}

export interface NetworkInspectOptions {
    /** Network ID or name */
    readonly id: string;
    /** Detailed inspect output for troubleshooting */
    readonly verbose?: boolean;
    /** Filter the network by scope (swarm, global, or local) */
    readonly scope?: string;
}

export interface NetworkConnectOptions {
    /** Network ID or name */
    readonly id: string;
    readonly container: NetworkConnectRequest;
}

export interface NetworkDisconnectOptions {
    /** Network ID or name */
    readonly id: string;
    readonly container: NetworkDisconnectRequest;
}

export interface NetworkPruneOptions {
    /**
     * Filters to process on the prune list, encoded as JSON (a
     * `map[string][]string`).
     *
     * Available filters:
     *
     * - `until=<timestamp>` Prune networks created before this timestamp. The
     *   `<timestamp>` can be Unix timestamps, date formatted timestamps, or Go
     *   duration strings (e.g. `10m`, `1h30m`) computed relative to the daemon
     *   machine’s time.
     * - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *   `label!=<key>=<value>`) Prune networks with (or without, in case
     *   `label!=...` is used) the specified labels.
     */
    readonly filters?: string;
}

export interface Networks {
    /**
     * List networks
     *
     * @param filters - JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the networks list.
     *
     *   Available filters:
     *
     *   - `dangling=<boolean>` When set to `true` (or `1`), returns all networks
     *       that are not in use by a container. When set to `false` (or `0`),
     *       only networks that are in use by one or more containers are
     *       returned.
     *   - `driver=<driver-name>` Matches a network's driver.
     *   - `id=<network-id>` Matches all or part of a network ID.
     *   - `label=<key>` or `label=<key>=<value>` of a network label.
     *   - `name=<network-name>` Matches all or part of a network name.
     *   - `scope=["swarm"|"global"|"local"]` Filters networks by scope (`swarm`,
     *       `global`, or `local`).
     *   - `type=["custom"|"builtin"]` Filters networks by type. The `custom`
     *       keyword returns all user-defined networks.
     */
    readonly list: (options?: NetworkListOptions | undefined) => Effect.Effect<Readonly<Array<Network>>, NetworksError>;

    /**
     * Remove a network
     *
     * @param id - Network ID or name
     */
    readonly delete: (options: NetworkDeleteOptions) => Effect.Effect<void, NetworksError>;

    /**
     * Inspect a network
     *
     * @param id - Network ID or name
     * @param verbose - Detailed inspect output for troubleshooting
     * @param scope - Filter the network by scope (swarm, global, or local)
     */
    readonly inspect: (options: NetworkInspectOptions) => Effect.Effect<Readonly<Network>, NetworksError>;

    /**
     * Create a network
     *
     * @param networkConfig - Network configuration
     */
    readonly create: (options: NetworkCreateRequest) => Effect.Effect<NetworkCreateResponse, NetworksError>;

    /**
     * Connect a container to a network
     *
     * @param id - Network ID or name
     * @param container -
     */
    readonly connect: (options: NetworkConnectOptions) => Effect.Effect<void, NetworksError>;

    /**
     * Disconnect a container from a network
     *
     * @param id - Network ID or name
     * @param container -
     */
    readonly disconnect: (options: NetworkDisconnectOptions) => Effect.Effect<void, NetworksError>;

    /**
     * Delete unused networks
     *
     * @param filters - Filters to process on the prune list, encoded as JSON (a
     *   `map[string][]string`).
     *
     *   Available filters:
     *
     *   - `until=<timestamp>` Prune networks created before this timestamp. The
     *       `<timestamp>` can be Unix timestamps, date formatted timestamps, or
     *       Go duration strings (e.g. `10m`, `1h30m`) computed relative to the
     *       daemon machine’s time.
     *   - `label` (`label=<key>`, `label=<key>=<value>`, `label!=<key>`, or
     *       `label!=<key>=<value>`) Prune networks with (or without, in case
     *       `label!=...` is used) the specified labels.
     */
    readonly prune: (options: NetworkPruneOptions) => Effect.Effect<NetworkPruneResponse, NetworksError>;
}

const make: Effect.Effect<Networks, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/networks`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const NetworksClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(Network)))
        );
        const NetworkClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Network)));
        const NetworkCreateResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(NetworkCreateResponse))
        );
        const NetworkPruneResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(NetworkPruneResponse))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new NetworksError({ method, message }));

        const list_ = (
            options?: NetworkListOptions | undefined
        ): Effect.Effect<Readonly<Array<Network>>, NetworksError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                NetworksClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const delete_ = (options: NetworkDeleteOptions): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClient.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const inspect_ = (options: NetworkInspectOptions): Effect.Effect<Readonly<Network>, NetworksError> =>
            Function.pipe(
                HttpClient.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("verbose", options.verbose),
                addQueryParameter("scope", options.scope),
                NetworkClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const create_ = (options: NetworkCreateRequest): Effect.Effect<NetworkCreateResponse, NetworksError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                HttpClient.request.schemaBody(NetworkCreateRequest)(options),
                Effect.flatMap(NetworkCreateResponseClient),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const connect_ = (options: NetworkConnectOptions): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/connect".replace("{id}", encodeURIComponent(options.id))),
                HttpClient.request.schemaBody(NetworkConnectRequest)(options.container),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("connect")),
                Effect.scoped
            );

        const disconnect_ = (options: NetworkDisconnectOptions): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/disconnect".replace("{id}", encodeURIComponent(options.id))),
                HttpClient.request.schemaBody(NetworkDisconnectRequest)(
                    options.container ?? new NetworkDisconnectRequest({})
                ),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("disconnect")),
                Effect.scoped
            );

        const prune_ = (options: NetworkPruneOptions): Effect.Effect<NetworkPruneResponse, NetworksError> =>
            Function.pipe(
                HttpClient.request.post("/prune"),
                addQueryParameter("filters", options.filters),
                NetworkPruneResponseClient,
                Effect.catchAll(responseHandler("prune")),
                Effect.scoped
            );

        return {
            list: list_,
            delete: delete_,
            inspect: inspect_,
            create: create_,
            connect: connect_,
            disconnect: disconnect_,
            prune: prune_,
        };
    }
);

export const Networks = Context.GenericTag<Networks>("the-moby-effect/Networks");
export const layer = Layer.effect(Networks, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
