/**
 * Networks service
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
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";

import {
    Network,
    NetworkConnectRequest,
    NetworkCreateRequest,
    NetworkCreateResponse,
    NetworkDisconnectRequest,
    NetworkPruneResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const NetworksErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/NetworksError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type NetworksErrorTypeId = typeof NetworksErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isNetworksError = (u: unknown): u is NetworksError => Predicate.hasProperty(u, NetworksErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class NetworksError extends PlatformError.RefailError(NetworksErrorTypeId, "NetworksError")<{
    method: string;
    error: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}: ${super.message}`;
    }
}

/** @since 1.0.0 */
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

/** @since 1.0.0 */
export interface NetworkDeleteOptions {
    /** Network ID or name */
    readonly id: string;
}

/** @since 1.0.0 */
export interface NetworkInspectOptions {
    /** Network ID or name */
    readonly id: string;
    /** Detailed inspect output for troubleshooting */
    readonly verbose?: boolean;
    /** Filter the network by scope (swarm, global, or local) */
    readonly scope?: string;
}

/** @since 1.0.0 */
export interface NetworkConnectOptions {
    /** Network ID or name */
    readonly id: string;
    readonly container: NetworkConnectRequest;
}

/** @since 1.0.0 */
export interface NetworkDisconnectOptions {
    /** Network ID or name */
    readonly id: string;
    readonly container: NetworkDisconnectRequest;
}

/** @since 1.0.0 */
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

/**
 * @since 1.0.0
 * @category Tags
 */
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

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<Networks, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/networks")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const NetworksClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(Network))));
    const NetworkClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Network)));
    const NetworkCreateResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(NetworkCreateResponse))
    );
    const NetworkPruneResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(NetworkPruneResponse))
    );

    const list_ = (options?: NetworkListOptions | undefined): Effect.Effect<Readonly<Array<Network>>, NetworksError> =>
        Function.pipe(
            HttpClientRequest.get(""),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            NetworksClient,
            Effect.mapError((error) => new NetworksError({ method: "list", error })),
            Effect.scoped
        );

    const delete_ = (options: NetworkDeleteOptions): Effect.Effect<void, NetworksError> =>
        Function.pipe(
            HttpClientRequest.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
            voidClient,
            Effect.mapError((error) => new NetworksError({ method: "delete", error })),
            Effect.scoped
        );

    const inspect_ = (options: NetworkInspectOptions): Effect.Effect<Readonly<Network>, NetworksError> =>
        Function.pipe(
            HttpClientRequest.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
            maybeAddQueryParameter("verbose", Option.fromNullable(options.verbose)),
            maybeAddQueryParameter("scope", Option.fromNullable(options.scope)),
            NetworkClient,
            Effect.mapError((error) => new NetworksError({ method: "inspect", error })),
            Effect.scoped
        );

    const create_ = (options: NetworkCreateRequest): Effect.Effect<NetworkCreateResponse, NetworksError> =>
        Function.pipe(
            HttpClientRequest.post("/create"),
            HttpClientRequest.schemaBody(NetworkCreateRequest)(options),
            Effect.flatMap(NetworkCreateResponseClient),
            Effect.mapError((error) => new NetworksError({ method: "create", error })),
            Effect.scoped
        );

    const connect_ = (options: NetworkConnectOptions): Effect.Effect<void, NetworksError> =>
        Function.pipe(
            HttpClientRequest.post("/{id}/connect".replace("{id}", encodeURIComponent(options.id))),
            HttpClientRequest.schemaBody(NetworkConnectRequest)(options.container),
            Effect.flatMap(voidClient),
            Effect.mapError((error) => new NetworksError({ method: "connect", error })),
            Effect.scoped
        );

    const disconnect_ = (options: NetworkDisconnectOptions): Effect.Effect<void, NetworksError> =>
        Function.pipe(
            HttpClientRequest.post("/{id}/disconnect".replace("{id}", encodeURIComponent(options.id))),
            HttpClientRequest.schemaBody(NetworkDisconnectRequest)(
                options.container ?? new NetworkDisconnectRequest({})
            ),
            Effect.flatMap(voidClient),
            Effect.mapError((error) => new NetworksError({ method: "disconnect", error })),
            Effect.scoped
        );

    const prune_ = (options: NetworkPruneOptions | undefined): Effect.Effect<NetworkPruneResponse, NetworksError> =>
        Function.pipe(
            HttpClientRequest.post("/prune"),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            NetworkPruneResponseClient,
            Effect.mapError((error) => new NetworksError({ method: "prune", error })),
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
});

/**
 * Networks service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Networks: Context.Tag<Networks, Networks> = Context.GenericTag<Networks>("@the-moby-effect/moby/Networks");

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Networks, never, HttpClient.HttpClient.Default> = Layer.effect(Networks, make);
