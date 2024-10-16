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
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";

import {
    NetworkConnectOptions as NetworkConnectRequest,
    NetworkCreateRequest,
    NetworkCreateResponse,
    NetworkDisconnectOptions as NetworkDisconnectRequest,
    NetworkPruneResponse,
    NetworkSummary,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const NetworksErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/NetworksError");

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
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
 */
export class Networks extends Effect.Service<Networks>()("@the-moby-effect/endpoints/Networks", {
    accessors: true,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

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
                Effect.mapError((cause) => new NetworksError({ method: "list", cause })),
                Effect.scoped
            );

        const delete_ = (options: { readonly id: string }): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClientRequest.del(`/networks/${encodeURIComponent(options.id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new NetworksError({ method: "delete", cause })),
                Effect.scoped
            );

        const inspect_ = (options: {
            readonly id: string;
            readonly verbose?: boolean;
            readonly scope?: string;
        }): Effect.Effect<Readonly<NetworkSummary>, NetworksError> =>
            Function.pipe(
                HttpClientRequest.get(`/networks/${encodeURIComponent(options.id)}`),
                maybeAddQueryParameter("verbose", Option.fromNullable(options.verbose)),
                maybeAddQueryParameter("scope", Option.fromNullable(options.scope)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(NetworkSummary)),
                Effect.mapError((cause) => new NetworksError({ method: "inspect", cause })),
                Effect.scoped
            );

        const create_ = (options: NetworkCreateRequest): Effect.Effect<NetworkCreateResponse, NetworksError> =>
            Function.pipe(
                HttpClientRequest.post("/networks/create"),
                HttpClientRequest.schemaBodyJson(NetworkCreateRequest)(options),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(NetworkCreateResponse)),
                Effect.mapError((cause) => new NetworksError({ method: "create", cause })),
                Effect.scoped
            );

        const connect_ = (options: {
            readonly id: string;
            readonly container: NetworkConnectRequest;
        }): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClientRequest.post(`/networks/${encodeURIComponent(options.id)}/connect`),
                HttpClientRequest.schemaBodyJson(NetworkConnectRequest)(options.container),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new NetworksError({ method: "connect", cause })),
                Effect.scoped
            );

        const disconnect_ = (options: {
            readonly id: string;
            readonly container: NetworkDisconnectRequest;
        }): Effect.Effect<void, NetworksError> =>
            Function.pipe(
                HttpClientRequest.post(`/networks/${encodeURIComponent(options.id)}/disconnect`),
                HttpClientRequest.schemaBodyJson(NetworkDisconnectRequest)(
                    options.container ?? NetworkDisconnectRequest.make({ Container: options.container, Force: false })
                ),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new NetworksError({ method: "disconnect", cause })),
                Effect.scoped
            );

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
                Effect.mapError((cause) => new NetworksError({ method: "prune", cause })),
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
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Networks, never, HttpClient.HttpClient> = Networks.Default;
