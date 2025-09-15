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
import {
    NetworkConnectOptions as NetworkConnectRequest,
    NetworkCreateRequest,
    NetworkCreateResponse,
    NetworkDisconnectOptions as NetworkDisconnectRequest,
    NetworkPruneResponse,
    NetworkSummary,
} from "../generated/index.js";

/** Filters for network list / prune (JSON encoded) */
export class NetworkFilters extends Schema.parseJson(Schema.Record({ key: Schema.String }, Schema.Any)) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkList */
const listNetworksEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(NetworkFilters) }))
    .addSuccess(Schema.Array(NetworkSummary), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkCreate */
const createNetworkEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(NetworkCreateRequest)
    .addSuccess(NetworkCreateResponse, { status: 201 })
    .addError(HttpApiError.BadRequest);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkInspect */
const inspectNetworkEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(
        Schema.Struct({
            verbose: Schema.optional(Schema.BooleanFromString),
            scope: Schema.optional(Schema.String),
        })
    )
    .addSuccess(NetworkSummary, { status: 200 })
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDelete */
const deleteNetworkEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkConnect */
const connectNetworkEndpoint = HttpApiEndpoint.post("connect", "/:id/connect")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(NetworkConnectRequest)
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDisconnect */
const disconnectNetworkEndpoint = HttpApiEndpoint.post("disconnect", "/:id/disconnect")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(NetworkDisconnectRequest)
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkPrune */
const pruneNetworkEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(NetworkFilters) }))
    .addSuccess(NetworkPruneResponse, { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network */
const NetworksGroup = HttpApiGroup.make("networks")
    .add(listNetworksEndpoint)
    .add(createNetworkEndpoint)
    .add(inspectNetworkEndpoint)
    .add(deleteNetworkEndpoint)
    .add(connectNetworkEndpoint)
    .add(disconnectNetworkEndpoint)
    .add(pruneNetworkEndpoint)
    .addError(HttpApiError.InternalServerError)
    .prefix("/networks");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export const NetworksApi = HttpApi.make("NetworksApi").add(NetworksGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export class NetworksService extends Effect.Service<NetworksService>()("@the-moby-effect/endpoints/Networks", {
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
        const client = yield* HttpApiClient.group(NetworksApi, { group: "networks", httpClient });

        const list_ = (filters?: Schema.Schema.Type<NetworkFilters>) => client.list({ urlParams: { filters } });
        const create_ = (payload: NetworkCreateRequest) => client.create({ payload });
        const inspect_ = (id: string, params?: { verbose?: boolean; scope?: string }) =>
            client.inspect({ path: { id }, urlParams: { ...params } });
        const delete_ = (id: string) => client.delete({ path: { id } });
        const connect_ = (id: string, payload: NetworkConnectRequest) => client.connect({ path: { id }, payload });
        const disconnect_ = (id: string, payload: NetworkDisconnectRequest) =>
            client.disconnect({ path: { id }, payload });
        const prune_ = (filters?: Schema.Schema.Type<NetworkFilters>) => client.prune({ urlParams: { filters } });

        return {
            list: list_,
            create: create_,
            inspect: inspect_,
            delete: delete_,
            connect: connect_,
            disconnect: disconnect_,
            prune: prune_,
        } as const;
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export const NetworksLayer: Layer.Layer<NetworksService, never, HttpClient.HttpClient> =
    NetworksService.DefaultWithoutDependencies as Layer.Layer<NetworksService, never, HttpClient.HttpClient>;

/**
 * Local socket auto-configured layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const NetworksLayerLocalSocket: Layer.Layer<NetworksService, never, HttpClient.HttpClient> =
    NetworksService.Default as Layer.Layer<NetworksService, never, HttpClient.HttpClient>;
