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
import * as Context from "effect/Context";
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
 */
export const NodesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/NodesError");

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface NodeListOptions {
    readonly filters?: {
        id?: [string] | undefined;
        label?: [string] | undefined;
        membership?: ["accepted" | "pending"] | undefined;
        name?: [string] | undefined;
        "node.label"?: [string] | undefined;
        role?: ["manager" | "worker"] | undefined;
    };
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface NodeDeleteOptions {
    /** The ID or name of the node */
    readonly id: string;
    /** Force remove a node from the swarm */
    readonly force?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface NodeInspectOptions {
    /** The ID or name of the node */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface NodeUpdateOptions {
    readonly body: SwarmNodeSpec;
    /** The ID of the node */
    readonly id: string;
    /**
     * The version number of the node object being updated. This is required to
     * avoid conflicting writes.
     */
    readonly version: number;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface NodesImpl {
    /** List nodes */
    readonly list: (
        options?: NodeListOptions | undefined
    ) => Effect.Effect<Readonly<Array<SwarmNode>>, NodesError, never>;

    /**
     * Delete a node
     *
     * @param id - The ID or name of the node
     * @param force - Force remove a node from the swarm
     */
    readonly delete: (options: NodeDeleteOptions) => Effect.Effect<void, NodesError, never>;

    /**
     * Inspect a node
     *
     * @param id - The ID or name of the node
     */
    readonly inspect: (options: NodeInspectOptions) => Effect.Effect<Readonly<SwarmNode>, NodesError, never>;

    /**
     * Update a node
     *
     * @param id - The ID of the node
     * @param body -
     * @param version - The version number of the node object being updated.
     *   This is required to avoid conflicting writes.
     */
    readonly update: (options: NodeUpdateOptions) => Effect.Effect<void, NodesError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<NodesImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/nodes")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const NodesClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmNode))));
    const NodeClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SwarmNode)));

    const list_ = (
        options?: NodeListOptions | undefined
    ): Effect.Effect<Readonly<Array<SwarmNode>>, NodesError, never> =>
        Function.pipe(
            HttpClientRequest.get(""),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            NodesClient,
            Effect.mapError((cause) => new NodesError({ method: "list", cause })),
            Effect.scoped
        );

    const delete_ = (options: NodeDeleteOptions): Effect.Effect<void, NodesError, never> =>
        Function.pipe(
            HttpClientRequest.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            voidClient,
            Effect.mapError((cause) => new NodesError({ method: "delete", cause })),
            Effect.scoped
        );

    const inspect_ = (options: NodeInspectOptions): Effect.Effect<Readonly<SwarmNode>, NodesError, never> =>
        Function.pipe(
            HttpClientRequest.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
            NodeClient,
            Effect.mapError((cause) => new NodesError({ method: "inspect", cause })),
            Effect.scoped
        );

    const update_ = (options: NodeUpdateOptions): Effect.Effect<void, NodesError, never> =>
        Function.pipe(
            HttpClientRequest.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
            maybeAddQueryParameter("version", Option.some(options.version)),
            HttpClientRequest.schemaBody(SwarmNodeSpec)(options.body),
            Effect.flatMap(voidClient),
            Effect.mapError((cause) => new NodesError({ method: "update", cause })),
            Effect.scoped
        );

    return {
        list: list_,
        delete: delete_,
        inspect: inspect_,
        update: update_,
    };
});

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Nodes {
    readonly _: unique symbol;
}

/**
 * Nodes service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Nodes: Context.Tag<Nodes, NodesImpl> = Context.GenericTag<Nodes, NodesImpl>("@the-moby-effect/Nodes");

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Nodes, never, HttpClient.HttpClient.Default> = Layer.effect(Nodes, make);
