import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Context, Data, Effect, Layer, Scope, pipe } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import { Node, NodeSpec } from "./schemas.js";

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
    readonly list: (options?: NodeListOptions | undefined) => Effect.Effect<never, NodesError, Readonly<Array<Node>>>;

    /**
     * Delete a node
     *
     * @param id - The ID or name of the node
     * @param force - Force remove a node from the swarm
     */
    readonly delete: (options: NodeDeleteOptions) => Effect.Effect<never, NodesError, void>;

    /**
     * Inspect a node
     *
     * @param id - The ID or name of the node
     */
    readonly inspect: (options: NodeInspectOptions) => Effect.Effect<never, NodesError, Readonly<Node>>;

    /**
     * Update a node
     *
     * @param id - The ID of the node
     * @param body -
     * @param version - The version number of the node object being updated.
     *   This is required to avoid conflicting writes.
     */
    readonly update: (options: NodeUpdateOptions) => Effect.Effect<never, NodesError, void>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Nodes> = Effect.gen(function* (
    _: Effect.Adapter
) {
    const agent = yield* _(MobyConnectionAgent);
    const defaultClient = yield* _(NodeHttp.client.Client);

    const client = defaultClient.pipe(
        NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/nodes`)),
        NodeHttp.client.filterStatusOk
    );

    const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
    const NodesClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Node))));
    const NodeClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Node)));

    const responseHandler = (method: string) => responseErrorHandler((message) => new NodesError({ method, message }));

    const list_ = (options?: NodeListOptions | undefined): Effect.Effect<never, NodesError, Readonly<Array<Node>>> =>
        pipe(
            NodeHttp.request.get(""),
            addQueryParameter("filters", options?.filters),
            NodesClient,
            Effect.catchAll(responseHandler("list"))
        );

    const delete_ = (options: NodeDeleteOptions): Effect.Effect<never, NodesError, void> =>
        pipe(
            NodeHttp.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
            addQueryParameter("force", options.force),
            voidClient,
            Effect.catchAll(responseHandler("delete"))
        );

    const inspect_ = (options: NodeInspectOptions): Effect.Effect<never, NodesError, Readonly<Node>> =>
        pipe(
            NodeHttp.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
            NodeClient,
            Effect.catchAll(responseHandler("inspect"))
        );

    const update_ = (options: NodeUpdateOptions): Effect.Effect<never, NodesError, void> =>
        pipe(
            NodeHttp.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
            addQueryParameter("version", options.version),
            NodeHttp.request.schemaBody(NodeSpec)(options.body),
            Effect.flatMap(voidClient),
            Effect.catchAll(responseHandler("update"))
        );

    return { list: list_, delete: delete_, inspect: inspect_, update: update_ };
});

export const Nodes = Context.Tag<Nodes>("the-moby-effect/Nodes");
export const layer = Layer.effect(Nodes, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
