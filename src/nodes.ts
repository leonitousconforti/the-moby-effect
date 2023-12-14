import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";
import { Node, NodeSchema, NodeSpec } from "./schemas.js";

export class NodeDeleteError extends Data.TaggedError("NodeDeleteError")<{ message: string }> {}
export class NodeInspectError extends Data.TaggedError("NodeInspectError")<{ message: string }> {}
export class NodeListError extends Data.TaggedError("NodeListError")<{ message: string }> {}
export class NodeUpdateError extends Data.TaggedError("NodeUpdateError")<{ message: string }> {}

export interface NodeDeleteOptions {
    /** The ID or name of the node */
    id: string;
    /** Force remove a node from the swarm */
    force?: boolean;
}

export interface NodeInspectOptions {
    /** The ID or name of the node */
    id: string;
}

export interface NodeListOptions {
    /**
     * Filters to process on the nodes list, encoded as JSON (a
     * `map[string][]string`). Available filters:
     *
     * - `id=<node id>`
     * - `label=<engine label>`
     * - `membership=`(`accepted`|`pending`)`
     * - `name=<node name>`
     * - `node.label=<node label>`
     * - `role=`(`manager`|`worker`)`
     */
    filters?: string;
}

export interface NodeUpdateOptions {
    /** The ID of the node */
    id: string;
    /**
     * The version number of the node object being updated. This is required to
     * avoid conflicting writes.
     */
    version: number;
    body?: NodeSpec;
}

/**
 * Delete a node
 *
 * @param id - The ID or name of the node
 * @param force - Force remove a node from the swarm
 */
export const nodeDelete = (options: NodeDeleteOptions): Effect.Effect<IMobyConnectionAgent, NodeDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/nodes/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(NodeDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a node
 *
 * @param id - The ID or name of the node
 */
export const nodeInspect = (
    options: NodeInspectOptions
): Effect.Effect<IMobyConnectionAgent, NodeInspectError, Readonly<Node>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/nodes/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(NodeSchema)))
            .pipe(responseErrorHandler(NodeInspectError));
    }).pipe(Effect.flatten);

/**
 * List nodes
 *
 * @param filters - Filters to process on the nodes list, encoded as JSON (a
 *   `map[string][]string`). Available filters:
 *
 *   - `id=<node id>`
 *   - `label=<engine label>`
 *   - `membership=`(`accepted`|`pending`)`
 *   - `name=<node name>`
 *   - `node.label=<node label>`
 *   - `role=`(`manager`|`worker`)`
 */
export const nodeList = (
    options?: NodeListOptions | undefined
): Effect.Effect<IMobyConnectionAgent, NodeListError, Readonly<Array<Node>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/nodes";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("filters", options?.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(NodeSchema))))
            .pipe(responseErrorHandler(NodeListError));
    }).pipe(Effect.flatten);

/**
 * Update a node
 *
 * @param id - The ID of the node
 * @param version - The version number of the node object being updated. This is
 *   required to avoid conflicting writes.
 * @param body -
 */
export const nodeUpdate = (options: NodeUpdateOptions): Effect.Effect<IMobyConnectionAgent, NodeUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.version === null || options.version === undefined) {
            yield* _(new NodeUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/nodes/{id}/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "NodeSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(NodeUpdateError));
    }).pipe(Effect.flatten);

export interface INodeService {
    Errors: NodeDeleteError | NodeInspectError | NodeListError | NodeUpdateError;

    /**
     * Delete a node
     *
     * @param id - The ID or name of the node
     * @param force - Force remove a node from the swarm
     */
    nodeDelete: WithConnectionAgentProvided<typeof nodeDelete>;

    /**
     * Inspect a node
     *
     * @param id - The ID or name of the node
     */
    nodeInspect: WithConnectionAgentProvided<typeof nodeInspect>;

    /**
     * List nodes
     *
     * @param filters - Filters to process on the nodes list, encoded as JSON (a
     *   `map[string][]string`). Available filters:
     *
     *   - `id=<node id>`
     *   - `label=<engine label>`
     *   - `membership=`(`accepted`|`pending`)`
     *   - `name=<node name>`
     *   - `node.label=<node label>`
     *   - `role=`(`manager`|`worker`)`
     */
    nodeList: WithConnectionAgentProvided<typeof nodeList>;

    /**
     * Update a node
     *
     * @param id - The ID of the node
     * @param version - The version number of the node object being updated.
     *   This is required to avoid conflicting writes.
     * @param body -
     */
    nodeUpdate: WithConnectionAgentProvided<typeof nodeUpdate>;
}
