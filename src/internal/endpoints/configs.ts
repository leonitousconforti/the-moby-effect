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
import { SwarmConfig, SwarmConfigSpec } from "../generated/index.ts";
import { ConfigIdentifier } from "../schemas/id.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound } from "./errors.ts";
import { NodeNotPartOfSwarm } from "./swarm.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.fromJsonString(
    Schema.Struct({
        id: Schema.optional(Schema.Array(ConfigIdentifier)),
        name: Schema.optional(Schema.Array(Schema.String)),
        names: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
    })
);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigList */
const listConfigsEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(ListFilters) },
    success: Schema.Array(SwarmConfig), // 200 OK
    error: [
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError, // 500 Internal Server Error
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigCreate */
const createConfigEndpoint = HttpApiEndpoint.post("create", "/create", {
    payload: SwarmConfigSpec,
    success: Schema.Struct({
        Id: ConfigIdentifier,
    }).pipe(
        Schema.encodeKeys({
            Id: "ID",
        }),
        HttpApiSchema.status(201)
    ), // 201 Created
    error: [
        Conflict, // 409 Name conflicts with existing object
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError, // 500 Internal Server Error
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigInspect */
const inspectConfigEndpoint = HttpApiEndpoint.get("inspect", "/:identifier", {
    params: { identifier: ConfigIdentifier },
    success: SwarmConfig, // 200 OK
    error: [
        NotFound, // 404 Config not found
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError, // 500 Internal Server Error
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigDelete */
const deleteConfigEndpoint = HttpApiEndpoint.delete("delete", "/:identifier", {
    params: { identifier: ConfigIdentifier },
    success: HttpApiSchema.NoContent, // 204 No Content
    error: [
        NotFound, // 404 Config not found
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError, // 500 Internal Server Error
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigUpdate */
const updateConfigEndpoint = HttpApiEndpoint.post("update", "/:identifier/update", {
    params: { identifier: ConfigIdentifier },
    query: { version: Schema.BigIntFromString },
    payload: SwarmConfigSpec, // Note: Docker API states only Labels can be updated
    success: HttpApiSchema.Empty(200), // 200 OK, no response body
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Config not found
        NodeNotPartOfSwarm, // 503 Node is not part of a swarm
        InternalServerError, // 500 Internal Server Error
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config */
const ConfigsGroup = HttpApiGroup.make("configs")
    .add(listConfigsEndpoint, createConfigEndpoint, inspectConfigEndpoint, deleteConfigEndpoint, updateConfigEndpoint)
    .prefix("/configs"); // Prefix for endpoints in this group

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export const ConfigsApi = HttpApi.make("ConfigsApi").add(ConfigsGroup);

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export class Configs extends Context.Service<Configs>()("@the-moby-effect/endpoints/Configs", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const ConfigsError = DockerError.WrapForModule("configs");
        const client = yield* HttpApiClient.group(ConfigsApi, { group: "configs", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof ListFilters> | undefined) =>
            client.list({ query: { filters } }).pipe(Effect.mapError(ConfigsError("list")));
        const create_ = (config: (typeof SwarmConfigSpec)["~type.make.in"]) =>
            SwarmConfigSpec.makeEffect(config).pipe(
                Effect.flatMap((payload) => client.create({ payload })),
                Effect.mapError(ConfigsError("create"))
            );
        const inspect_ = (identifier: ConfigIdentifier) =>
            client.inspect({ params: { identifier } }).pipe(Effect.mapError(ConfigsError("inspect")));
        const delete_ = (identifier: ConfigIdentifier) =>
            client.delete({ params: { identifier } }).pipe(Effect.mapError(ConfigsError("delete")));
        const update_ = (
            identifier: ConfigIdentifier,
            version: bigint,
            config: (typeof SwarmConfigSpec)["~type.make.in"]
        ) =>
            SwarmConfigSpec.makeEffect(config).pipe(
                Effect.flatMap((payload) =>
                    client.update({
                        params: { identifier },
                        query: { version },
                        payload,
                    })
                ),
                Effect.mapError(ConfigsError("update"))
            );

        return {
            list: list_,
            create: create_,
            inspect: inspect_,
            delete: delete_,
            update: update_,
        };
    }),
}) {}

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export const ConfigsLayer: Layer.Layer<Configs, never, HttpClient.HttpClient> = Layer.effect(Configs, Configs.make);

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export const ConfigsLayerLocalSocket = ConfigsLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
