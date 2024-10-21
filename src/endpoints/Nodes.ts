/**
 * Nodes service
 *
 * @since 1.0.0
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Node
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

import { SwarmNode, SwarmNodeSpec } from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const NodesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/NodesError");

/**
 * @since 1.0.0
 * @category Errors
 * @internal
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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
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
 */
export class Nodes extends Effect.Service<Nodes>()("@the-moby-effect/endpoints/Nodes", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

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
                Effect.mapError((cause) => new NodesError({ method: "list", cause })),
                Effect.scoped
            );

        const delete_ = (options: {
            readonly id: string;
            readonly force?: boolean | undefined;
        }): Effect.Effect<void, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/nodes/${encodeURIComponent(options.id)}`),
                maybeAddQueryParameter("force", Option.fromNullable(options.force)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmNode))),
                Effect.mapError((cause) => new NodesError({ method: "delete", cause })),
                Effect.scoped
            );

        const inspect_ = (options: { readonly id: string }): Effect.Effect<Readonly<SwarmNode>, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/nodes/${encodeURIComponent(options.id)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmNode)),
                Effect.mapError((cause) => new NodesError({ method: "inspect", cause })),
                Effect.scoped
            );

        const update_ = (options: {
            readonly body: SwarmNodeSpec;
            readonly id: string;
            readonly version: number;
        }): Effect.Effect<void, NodesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/nodes/${encodeURIComponent(options.id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBodyJson(SwarmNodeSpec)(options.body),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new NodesError({ method: "update", cause })),
                Effect.scoped
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
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const NodesLayer: Layer.Layer<Nodes, never, HttpClient.HttpClient> = Nodes.Default;
