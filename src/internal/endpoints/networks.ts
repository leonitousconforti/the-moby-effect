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
    NetworkSummary,
} from "../generated/index.js";
import { ContainerId, NetworkId } from "../schemas/id.js";

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        dangling: Schema.optional(Schema.BooleanFromString),
        driver: Schema.optional(Schema.Array(Schema.String)),
        id: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.Array(Schema.String)),
        scope: Schema.optional(Schema.Array(Schema.String)),
        type: Schema.optional(Schema.Literal("custom", "builtin")),
    })
) {}

/** @since 1.0.0 */
export class PruneFilters extends Schema.parseJson(
    Schema.Struct({
        label: Schema.optional(Schema.Array(Schema.String)),
        until: Schema.optional(Schema.String),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkList */
const listNetworksEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(ListFilters) }))
    .addSuccess(Schema.Array(NetworkSummary), { status: 200 });

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
    .addError(HttpApiError.NotFound); // 404 No such network

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDelete */
const deleteNetworkEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.Forbidden) // 403 Not supported for pre-defined networks
    .addError(HttpApiError.NotFound); // 404 No such network

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkCreate */
const createNetworkEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(NetworkCreateRequest)
    .addSuccess(Schema.Struct({ Id: NetworkId }), { status: 201 })
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.Forbidden) // 403 Forbidden operation
    .addError(HttpApiError.NotFound); // 404 Plugin not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkConnect */
const connectNetworkEndpoint = HttpApiEndpoint.post("connect", "/:id/connect")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(NetworkConnectRequest)
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.Forbidden) // 403 Forbidden operation
    .addError(HttpApiError.NotFound); // 404 Plugin not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDisconnect */
const disconnectNetworkEndpoint = HttpApiEndpoint.post("disconnect", "/:id/disconnect")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(Schema.Struct({ Container: ContainerId, Force: Schema.Boolean }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.Forbidden) // 403 Forbidden operation
    .addError(HttpApiError.NotFound); // 404 Plugin not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkPrune */
const pruneNetworkEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(PruneFilters) }))
    .addSuccess(Schema.Struct({ NetworksDeleted: Schema.optional(Schema.Array(Schema.String)) }), { status: 200 });

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
export class Networks extends Effect.Service<Networks>()("@the-moby-effect/endpoints/Networks", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof NetworksGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof NetworksGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(NetworksApi, { group: "networks", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters>) => client.list({ urlParams: { filters } });
        const create_ = (payload: NetworkCreateRequest) => client.create({ payload });
        const inspect_ = (id: string, options?: Options<"inspect">) =>
            client.inspect({ path: { id }, urlParams: { ...options } });
        const delete_ = (id: string) => client.delete({ path: { id } });
        const connect_ = (id: string, payload: NetworkConnectRequest) => client.connect({ path: { id }, payload });
        const disconnect_ = (
            id: string,
            containerId: ContainerId,
            options?: { force?: boolean | undefined } | undefined
        ) => client.disconnect({ path: { id }, payload: { Container: containerId, Force: options?.force ?? false } });
        const prune_ = (filters?: Schema.Schema.Type<PruneFilters>) => client.prune({ urlParams: { filters } });

        return {
            list: list_,
            create: create_,
            inspect: inspect_,
            delete: delete_,
            connect: connect_,
            disconnect: disconnect_,
            prune: prune_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export const NetworksLayer: Layer.Layer<Networks, never, HttpClient.HttpClient> = Networks.DefaultWithoutDependencies;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export const NetworksLayerLocalSocket: Layer.Layer<Networks, never, HttpClient.HttpClient> = Networks.Default;
