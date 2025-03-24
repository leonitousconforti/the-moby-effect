/**
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Tuple from "effect/Tuple";

import {
    NetworkConnectOptions as NetworkConnectRequest,
    NetworkCreateRequest,
    NetworkCreateResponse,
    NetworkDisconnectOptions as NetworkDisconnectRequest,
    NetworkPruneResponse,
    NetworkSummary,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const NetworksErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/NetworksError"
) as NetworksErrorTypeId;

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
export class NetworksError extends PlatformError.TypeIdError(NetworksErrorTypeId, "NetworksError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Networks service
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export class Networks extends Effect.Service<Networks>()("@the-moby-effect/endpoints/Networks", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkList */
        const list_ = (
            options?: { readonly filters?: Record<string, string | Array<string>> } | undefined
        ): Effect.Effect<Readonly<Array<NetworkSummary>>, NetworksError> =>
            Function.pipe(
                HttpClientRequest.get("/networks"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(NetworkSummary))),
                Effect.mapError((cause) => new NetworksError({ method: "list", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDelete */
        const delete_ = (id: string): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClientRequest.del(`/networks/${encodeURIComponent(id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new NetworksError({ method: "delete", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkInspect */
        const inspect_ = (
            id: string,
            options?:
                | {
                      readonly verbose?: boolean;
                      readonly scope?: string;
                  }
                | undefined
        ): Effect.Effect<Readonly<NetworkSummary>, NetworksError> =>
            Function.pipe(
                HttpClientRequest.get(`/networks/${encodeURIComponent(id)}`),
                maybeAddQueryParameter("verbose", Option.fromNullable(options?.verbose)),
                maybeAddQueryParameter("scope", Option.fromNullable(options?.scope)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(NetworkSummary)),
                Effect.mapError((cause) => new NetworksError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkCreate */
        const create_ = (
            createRequest: typeof NetworkCreateRequest.Encoded
        ): Effect.Effect<NetworkCreateResponse, NetworksError> =>
            Function.pipe(
                Schema.decode(NetworkCreateRequest)(createRequest),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/networks/create"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(NetworkCreateRequest))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(NetworkCreateResponse)),
                Effect.mapError((cause) => new NetworksError({ method: "create", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkConnect */
        const connect_ = (
            id: string,
            connectRequest: typeof NetworkConnectRequest.Encoded
        ): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                Schema.decode(NetworkConnectRequest)(connectRequest),
                Effect.map((body) =>
                    Tuple.make(HttpClientRequest.post(`/networks/${encodeURIComponent(id)}/connect`), body)
                ),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(NetworkConnectRequest))),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new NetworksError({ method: "connect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDisconnect */
        const disconnect_ = (
            id: string,
            disconnectRequest: typeof NetworkDisconnectRequest.Encoded
        ): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                Schema.decode(NetworkDisconnectRequest)(disconnectRequest),
                Effect.map((body) =>
                    Tuple.make(HttpClientRequest.post(`/networks/${encodeURIComponent(id)}/disconnect`), body)
                ),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(NetworkDisconnectRequest))),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new NetworksError({ method: "disconnect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkPrune */
        const prune_ = (
            options: { readonly filters?: Record<string, string | Array<string>> } | undefined
        ): Effect.Effect<NetworkPruneResponse, NetworksError, never> =>
            Function.pipe(
                HttpClientRequest.post("/networks/prune"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(NetworkPruneResponse)),
                Effect.mapError((cause) => new NetworksError({ method: "prune", cause }))
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
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export const NetworksLayer: Layer.Layer<Networks, never, HttpClient.HttpClient> = Networks.Default;
