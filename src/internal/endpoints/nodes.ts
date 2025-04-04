import type * as HttpBody from "@effect/platform/HttpBody";
import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Layer from "effect/Layer";
import type * as ParseResult from "effect/ParseResult";

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";

import { SwarmNode, SwarmNodeSpec } from "../generated/index.js";
import { maybeAddQueryParameter } from "./common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const NodesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/NodesError") as NodesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type NodesErrorTypeId = typeof NodesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isNodesError = (u: unknown): u is NodesError => Predicate.hasProperty(u, NodesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class NodesError extends PlatformError.TypeIdError(NodesErrorTypeId, "NodesError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Nodes service
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Node
 */
export class Nodes extends Effect.Service<Nodes>()("@the-moby-effect/endpoints/Nodes", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeList */
        const list_ = (
            options?:
                | {
                      readonly filters?: {
                          id?: [string] | undefined;
                          label?: [string] | undefined;
                          membership?: ["accepted" | "pending"] | undefined;
                          name?: [string] | undefined;
                          "node.label"?: [string] | undefined;
                          role?: ["manager" | "worker"] | undefined;
                      };
                  }
                | undefined
        ): Effect.Effect<Readonly<Array<SwarmNode>>, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.get("/nodes"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmNode))),
                Effect.mapError((cause) => new NodesError({ method: "list", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeDelete */
        const delete_ = (
            id: string,
            options?:
                | {
                      readonly force?: boolean | undefined;
                  }
                | undefined
        ): Effect.Effect<void, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/nodes/${encodeURIComponent(id)}`),
                maybeAddQueryParameter("force", Option.fromNullable(options?.force)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmNode))),
                Effect.mapError((cause) => new NodesError({ method: "delete", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeInspect */
        const inspect_ = (id: string): Effect.Effect<Readonly<SwarmNode>, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/nodes/${encodeURIComponent(id)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmNode)),
                Effect.mapError((cause) => new NodesError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeUpdate */
        const update_ = (
            id: string,
            options: {
                readonly body: SwarmNodeSpec;
                readonly version: number;
            }
        ): Effect.Effect<void, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/nodes/${encodeURIComponent(id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBodyJson(SwarmNodeSpec)(options.body),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new NodesError({ method: "update", cause }))
            );

        return {
            list: list_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Node
 */
export const NodesLayer: Layer.Layer<Nodes, never, HttpClient.HttpClient> = Nodes.Default;
