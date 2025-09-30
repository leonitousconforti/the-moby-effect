import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpApiSchema, HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmNode, SwarmNodeSpec } from "../generated/index.js";
import { DockerError } from "./circular.ts";
import { BadRequest, InternalServerError, NotFound } from "./httpApiHacks.ts";
import { NodeNotPartOfSwarm } from "./swarm.js";

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        id: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        membership: Schema.optional(Schema.Array(Schema.Literal("accepted", "pending"))),
        name: Schema.optional(Schema.Array(Schema.String)),
        "node.label": Schema.optional(Schema.Array(Schema.String)),
        role: Schema.optional(Schema.Array(Schema.Literal("manager", "worker"))),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeList */
const listNodesEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(ListFilters) }))
    .addSuccess(Schema.Array(SwarmNode), { status: 200 })
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeInspect */
const inspectNodeEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(SwarmNode, { status: 200 })
    .addError(NotFound) // 404 No such node
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeDelete */
const deleteNodeEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(NotFound) // 404 No such node
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeUpdate */
const updateNodeEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(Schema.Struct({ version: Schema.NumberFromString }))
    .setPayload(SwarmNodeSpec)
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(BadRequest) // 400 Bad parameter
    .addError(NotFound) // 404 No such node
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node */
const NodesGroup = HttpApiGroup.make("nodes")
    .add(listNodesEndpoint)
    .add(inspectNodeEndpoint)
    .add(deleteNodeEndpoint)
    .add(updateNodeEndpoint)
    .addError(InternalServerError)
    .prefix("/nodes");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
 */
export const NodesApi = HttpApi.make("NodesApi").add(NodesGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
 */
export class Nodes extends Effect.Service<Nodes>()("@the-moby-effect/endpoints/Nodes", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const NodesError = DockerError.WrapForModule("nodes");
        const client = yield* HttpApiClient.group(NodesApi, { group: "nodes", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters>) =>
            Effect.mapError(client.list({ urlParams: { filters } }), NodesError("list"));
        const inspect_ = (id: string) => Effect.mapError(client.inspect({ path: { id } }), NodesError("inspect"));
        const delete_ = (id: string, options?: { force?: boolean | undefined } | undefined) =>
            Effect.mapError(client.delete({ path: { id }, urlParams: { ...options } }), NodesError("delete"));
        const update_ = (id: string, version: number, payload: SwarmNodeSpec) =>
            Effect.mapError(client.update({ path: { id }, urlParams: { version }, payload }), NodesError("update"));

        return {
            list: list_,
            inspect: inspect_,
            delete: delete_,
            update: update_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
 */
export const NodesLayer: Layer.Layer<Nodes, never, HttpClient.HttpClient> = Nodes.DefaultWithoutDependencies;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
 */
export const NodesLayerLocalSocket: Layer.Layer<Nodes, never, HttpClient.HttpClient> = Nodes.Default;
