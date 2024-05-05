/**
 * Nodes service
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
import { Node, NodeSpec } from "./Schemas.js";

export class NodesError extends Data.TaggedError("NodesError")<{
    method: string;
    message: string;
}> {}

export interface NodeListOptions {
    /**
     * Filters to process on the nodes list, encoded as JSON (a
     * `map[string][]string`).
     *
     * Available filters:
     *
     * - `id=<node id>`
     * - `label=<engine label>`
     * - `membership=`(`accepted`|`pending`)`
     * - `name=<node name>`
     * - `node.label=<node label>`
     * - `role=`(`manager`|`worker`)`
     */
    readonly filters?: {
        id?: [string] | undefined;
        label?: [string] | undefined;
        membership?: ["accepted" | "pending"] | undefined;
        name?: [string] | undefined;
        "node.label"?: [string] | undefined;
        role?: ["manager" | "worker"] | undefined;
    };
}

export interface NodeDeleteOptions {
    /** The ID or name of the node */
    readonly id: string;
    /** Force remove a node from the swarm */
    readonly force?: boolean;
}

export interface NodeInspectOptions {
    /** The ID or name of the node */
    readonly id: string;
}

export interface NodeUpdateOptions {
    /** The ID of the node */
    readonly id: string;
    readonly body: NodeSpec;
    /**
     * The version number of the node object being updated. This is required to
     * avoid conflicting writes.
     */
    readonly version: number;
}

export interface Nodes {
    /**
     * List nodes
     *
     * @param filters - Filters to process on the nodes list, encoded as JSON (a
     *   `map[string][]string`).
     *
     *   Available filters:
     *
     *   - `id=<node id>`
     *   - `label=<engine label>`
     *   - `membership=`(`accepted`|`pending`)`
     *   - `name=<node name>`
     *   - `node.label=<node label>`
     *   - `role=`(`manager`|`worker`)`
     */
    readonly list: (options?: NodeListOptions | undefined) => Effect.Effect<Readonly<Array<Node>>, NodesError>;

    /**
     * Delete a node
     *
     * @param id - The ID or name of the node
     * @param force - Force remove a node from the swarm
     */
    readonly delete: (options: NodeDeleteOptions) => Effect.Effect<void, NodesError>;

    /**
     * Inspect a node
     *
     * @param id - The ID or name of the node
     */
    readonly inspect: (options: NodeInspectOptions) => Effect.Effect<Readonly<Node>, NodesError>;

    /**
     * Update a node
     *
     * @param id - The ID of the node
     * @param body -
     * @param version - The version number of the node object being updated.
     *   This is required to avoid conflicting writes.
     */
    readonly update: (options: NodeUpdateOptions) => Effect.Effect<void, NodesError>;
}

const make: Effect.Effect<Nodes, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/nodes`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const NodesClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(Node)))
        );
        const NodeClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Node)));

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new NodesError({ method, message }));

        const list_ = (options?: NodeListOptions | undefined): Effect.Effect<Readonly<Array<Node>>, NodesError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", options?.filters),
                NodesClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const delete_ = (options: NodeDeleteOptions): Effect.Effect<void, NodesError> =>
            Function.pipe(
                HttpClient.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("force", options.force),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const inspect_ = (options: NodeInspectOptions): Effect.Effect<Readonly<Node>, NodesError> =>
            Function.pipe(
                HttpClient.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                NodeClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const update_ = (options: NodeUpdateOptions): Effect.Effect<void, NodesError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("version", options.version),
                HttpClient.request.schemaBody(NodeSpec)(options.body),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        return { list: list_, delete: delete_, inspect: inspect_, update: update_ };
    }
);

export const Nodes = Context.GenericTag<Nodes>("the-moby-effect/Nodes");
export const layer = Layer.effect(Nodes, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
