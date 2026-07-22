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
import { NetworkConnectOptions, NetworkCreateRequest, NetworkInspect } from "../generated/index.ts";
import { ContainerIdentifier, NetworkIdentifier } from "../schemas/id.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Forbidden, InternalServerError, NotFound } from "./errors.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.fromJsonString(Schema.Struct({
    dangling: Schema.optional(Schema.Literals(["true", "false"]).transform([true, false])),
    driver: Schema.optional(Schema.Array(Schema.String)),
    id: Schema.optional(Schema.Array(Schema.String)),
    label: Schema.optional(Schema.Array(Schema.String)),
    name: Schema.optional(Schema.Array(Schema.String)),
    scope: Schema.optional(Schema.Array(Schema.String)),
    type: Schema.optional(Schema.Literals(["custom", "builtin"])),
}));

/** @since 1.0.0 */
export const PruneFilters = Schema.fromJsonString(Schema.Struct({
    label: Schema.optional(Schema.Array(Schema.String)),
    until: Schema.optional(Schema.String),
}));

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkList */
const listNetworksEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(ListFilters) },
    success: Schema.Array(NetworkInspect), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkInspect */
const inspectNetworkEndpoint = HttpApiEndpoint.get("inspect", "/:id", {
    params: { id: Schema.String },
    query: {
        verbose: Schema.optional(Schema.Boolean),
        scope: Schema.optional(Schema.String),
    },
    success: NetworkInspect, // 200 OK
    error: [
        NotFound, // 404 No such network
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDelete */
const deleteNetworkEndpoint = HttpApiEndpoint.delete("delete", "/:id", {
    params: { id: Schema.String },
    success: HttpApiSchema.NoContent, // 204 No Content
    error: [
        Forbidden, // 403 Not supported for pre-defined networks
        NotFound, // 404 No such network
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkCreate */
const createNetworkEndpoint = HttpApiEndpoint.post("create", "/create", {
    payload: NetworkCreateRequest,
    success: Schema.Struct({ Id: NetworkIdentifier }).pipe(HttpApiSchema.status(201)), // 201 Created
    error: [
        BadRequest, // 400 Bad parameter
        Forbidden, // 403 Forbidden operation
        NotFound, // 404 Plugin not found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkConnect */
const connectNetworkEndpoint = HttpApiEndpoint.post("connect", "/:id/connect", {
    params: { id: Schema.String },
    payload: NetworkConnectOptions,
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        Forbidden, // 403 Forbidden operation
        NotFound, // 404 Plugin not found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkDisconnect */
const disconnectNetworkEndpoint = HttpApiEndpoint.post("disconnect", "/:id/disconnect", {
    params: { id: Schema.String },
    payload: Schema.Struct({ Container: ContainerIdentifier, Force: Schema.Boolean }),
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        Forbidden, // 403 Forbidden operation
        NotFound, // 404 Plugin not found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network/operation/NetworkPrune */
const pruneNetworkEndpoint = HttpApiEndpoint.post("prune", "/prune", {
    query: { filters: Schema.optional(PruneFilters) },
    success: Schema.Struct({ NetworksDeleted: Schema.NullishOr(Schema.Array(Schema.String)) }), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Network */
const NetworksGroup = HttpApiGroup.make("networks")
    .add(
        listNetworksEndpoint,
        createNetworkEndpoint,
        inspectNetworkEndpoint,
        deleteNetworkEndpoint,
        connectNetworkEndpoint,
        disconnectNetworkEndpoint,
        pruneNetworkEndpoint
    )
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
export class Networks extends Context.Service<Networks>()("@the-moby-effect/endpoints/Networks", {
    make: Effect.gen(function* () {
        type NetworksEndpoints = HttpApiGroup.Endpoints<typeof NetworksGroup>;
        type Options<Name extends NetworksEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            NetworksEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* HttpClient.HttpClient;
        const NetworksError = DockerError.WrapForModule("networks");
        const client = yield* HttpApiClient.group(NetworksApi, { group: "networks", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof ListFilters>) =>
            client.list({ query: { filters } }).pipe(Effect.mapError(NetworksError("list")));
        const create_ = (payload: (typeof NetworkCreateRequest)["~type.make.in"]) =>
            NetworkCreateRequest.makeEffect(payload).pipe(
                Effect.flatMap((payload) => client.create({ payload })),
                Effect.mapError(NetworksError("create"))
            );
        const inspect_ = (id: string, options?: Options<"inspect">) =>
            client.inspect({ params: { id }, query: { ...options } }).pipe(Effect.mapError(NetworksError("inspect")));
        const delete_ = (id: string) =>
            client.delete({ params: { id } }).pipe(Effect.mapError(NetworksError("delete")));
        const connect_ = (id: string, payload: (typeof NetworkConnectOptions)["~type.make.in"]) =>
            NetworkConnectOptions.makeEffect(payload).pipe(
                Effect.flatMap((payload) =>
                    client.connect({
                        params: { id },
                        payload,
                    })
                ),
                Effect.mapError(NetworksError("connect"))
            );
        const disconnect_ = (
            id: string,
            containerId: ContainerIdentifier,
            options?: { force?: boolean | undefined } | undefined
        ) =>
            client
                .disconnect({
                    params: { id },
                    payload: { Container: containerId, Force: options?.force ?? false },
                })
                .pipe(Effect.mapError(NetworksError("disconnect")));
        const prune_ = (filters?: Schema.Schema.Type<typeof PruneFilters>) =>
            client.prune({ query: { filters } }).pipe(Effect.mapError(NetworksError("prune")));

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
export const NetworksLayer: Layer.Layer<Networks, never, HttpClient.HttpClient> = Layer.effect(Networks, Networks.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Network
 */
export const NetworksLayerLocalSocket: Layer.Layer<Networks, never, HttpClient.HttpClient> = NetworksLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
