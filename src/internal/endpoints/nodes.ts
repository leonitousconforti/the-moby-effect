import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
} from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmNode, SwarmNodeSpec } from "../generated/index.js";

/** Node list filters (JSON encoded) */
export class NodeListFilters extends Schema.parseJson(
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
    .setUrlParams(Schema.Struct({ filters: Schema.optional(NodeListFilters) }))
    .addSuccess(Schema.Array(SwarmNode), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeInspect */
const inspectNodeEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(SwarmNode, { status: 200 })
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeDelete */
const deleteNodeEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.NoContent)
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node/operation/NodeUpdate */
const updateNodeEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(
        Schema.Struct({
            version: Schema.Number, // required
            rotateWorkerToken: Schema.optional(Schema.BooleanFromString),
            rotateManagerToken: Schema.optional(Schema.BooleanFromString),
            rotateManagerUnlockKey: Schema.optional(Schema.BooleanFromString),
        })
    )
    .setPayload(SwarmNodeSpec)
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound)
    .addError(HttpApiError.BadRequest);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Node */
const NodesGroup = HttpApiGroup.make("nodes")
    .add(listNodesEndpoint)
    .add(inspectNodeEndpoint)
    .add(deleteNodeEndpoint)
    .add(updateNodeEndpoint)
    .addError(HttpApiError.InternalServerError)
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
export class NodesService extends Effect.Service<NodesService>()("@the-moby-effect/endpoints/Nodes", {
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
        const client = yield* HttpApiClient.group(NodesApi, { group: "nodes", httpClient });

        const list_ = (filters?: Schema.Schema.Type<NodeListFilters>) => client.list({ urlParams: { filters } });
        const inspect_ = (id: string) => client.inspect({ path: { id } });
        const delete_ = (id: string, options?: { force?: boolean }) =>
            client.delete({ path: { id }, urlParams: { force: options?.force } });
        const update_ = (
            id: string,
            payload: SwarmNodeSpec,
            params: {
                version: number;
                rotateWorkerToken?: boolean;
                rotateManagerToken?: boolean;
                rotateManagerUnlockKey?: boolean;
            }
        ) => client.update({ path: { id }, urlParams: { ...params }, payload });

        return {
            list: list_,
            inspect: inspect_,
            delete: delete_,
            update: update_,
        } as const;
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Node
 */
export const NodesLayer: Layer.Layer<NodesService, never, HttpClient.HttpClient> =
    NodesService.DefaultWithoutDependencies as Layer.Layer<NodesService, never, HttpClient.HttpClient>;

/**
 * Local socket auto-configured layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const NodesLayerLocalSocket: Layer.Layer<NodesService, never, HttpClient.HttpClient> =
    NodesService.Default as Layer.Layer<NodesService, never, HttpClient.HttpClient>;

/** Alias for pre-refactor naming consistency */
export { NodesService as Nodes };
