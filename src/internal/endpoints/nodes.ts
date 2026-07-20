import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import { MobyConnectionOptions } from "../../MobyConnection.ts";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.ts";
import { SwarmNode, SwarmNodeSpec } from "../generated/index.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, InternalServerError, NotFound, ServiceUnavailable } from "./errors.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.Struct({
    id: Schema.optional(Schema.Array(Schema.String)),
    label: Schema.optional(Schema.Array(Schema.String)),
    membership: Schema.optional(Schema.Array(Schema.Literals(["accepted", "pending"]))),
    name: Schema.optional(Schema.Array(Schema.String)),
    "node.label": Schema.optional(Schema.Array(Schema.String)),
    role: Schema.optional(Schema.Array(Schema.Literals(["manager", "worker"]))),
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeList */
const listNodesEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(ListFilters) },
    success: Schema.Array(SwarmNode), // 200 OK
    error: [
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeInspect */
const inspectNodeEndpoint = HttpApiEndpoint.get("inspect", "/:id", {
    params: { id: Schema.String },
    success: SwarmNode, // 200 OK
    error: [
        NotFound, // 404 No such node
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeDelete */
const deleteNodeEndpoint = HttpApiEndpoint.delete("delete", "/:id", {
    params: { id: Schema.String },
    query: { force: Schema.optional(Schema.Boolean) },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NotFound, // 404 No such node
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeUpdate */
const updateNodeEndpoint = HttpApiEndpoint.post("update", "/:id/update", {
    params: { id: Schema.String },
    query: { version: Schema.Number },
    payload: SwarmNodeSpec,
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 No such node
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node */
const NodesGroup = HttpApiGroup.make("nodes")
    .add(listNodesEndpoint, inspectNodeEndpoint, deleteNodeEndpoint, updateNodeEndpoint)
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
export class Nodes extends Context.Service<Nodes>()("@the-moby-effect/endpoints/Nodes", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const NodesError = DockerError.WrapForModule("nodes");
        const client = yield* HttpApiClient.group(NodesApi, { group: "nodes", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof ListFilters>) =>
            Effect.mapError(client.list({ query: { filters } }), NodesError("list"));
        const inspect_ = (id: string) => Effect.mapError(client.inspect({ params: { id } }), NodesError("inspect"));
        const delete_ = (id: string, options?: { force?: boolean | undefined } | undefined) =>
            Effect.mapError(client.delete({ params: { id }, query: { ...options } }), NodesError("delete"));
        const update_ = (id: string, version: number, payload: (typeof SwarmNodeSpec)["~type.make.in"]) =>
            Effect.mapError(
                client.update({ params: { id }, query: { version }, payload: new SwarmNodeSpec(payload) }),
                NodesError("update")
            );

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
export const NodesLayer: Layer.Layer<Nodes, never, HttpClient.HttpClient> = Layer.effect(Nodes, Nodes.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
 */
export const NodesLayerLocalSocket: Layer.Layer<Nodes, never, HttpClient.HttpClient> = NodesLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
