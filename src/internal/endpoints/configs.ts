import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpApiSchema, HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmConfig, SwarmConfigSpec } from "../generated/index.js";
import { ConfigIdentifier } from "../schemas/id.js";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound } from "./httpApiHacks.ts";
import { NodeNotPartOfSwarm } from "./swarm.js";

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        id: Schema.optional(Schema.Array(ConfigIdentifier)),
        name: Schema.optional(Schema.Array(Schema.String)),
        names: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigList */
const listConfigsEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(ListFilters) }))
    .addSuccess(Schema.Array(SwarmConfig), { status: 200 }); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigCreate */
const createConfigEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(SwarmConfigSpec)
    .addSuccess(Schema.rename(Schema.Struct({ ID: ConfigIdentifier }), { ID: "Id" }), { status: 201 }) // 201 Created
    .addError(Conflict); // 409 Name conflicts with existing object

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigInspect */
const inspectConfigEndpoint = HttpApiEndpoint.get("inspect", "/:identifier")
    .setPath(Schema.Struct({ identifier: ConfigIdentifier }))
    .addSuccess(SwarmConfig, { status: 200 }) // 200 OK
    .addError(NotFound); // 404 Config not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigDelete */
const deleteConfigEndpoint = HttpApiEndpoint.del("delete", "/:identifier")
    .setPath(Schema.Struct({ identifier: ConfigIdentifier }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(NotFound); // 404 Config not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigUpdate */
const updateConfigEndpoint = HttpApiEndpoint.post("update", "/:identifier/update")
    .setPath(Schema.Struct({ identifier: ConfigIdentifier }))
    .setUrlParams(Schema.Struct({ version: Schema.BigInt }))
    .setPayload(SwarmConfigSpec) // Note: Docker API states only Labels can be updated
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK, no response body
    .addError(BadRequest) // 400 Bad parameter
    .addError(NotFound); // 404 Config not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config */
const ConfigsGroup = HttpApiGroup.make("configs")
    .add(listConfigsEndpoint)
    .add(createConfigEndpoint)
    .add(inspectConfigEndpoint)
    .add(deleteConfigEndpoint)
    .add(updateConfigEndpoint)
    .addError(NodeNotPartOfSwarm) // 503 Node not part of swarm
    .addError(InternalServerError) // 500 Server error
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
export class Configs extends Effect.Service<Configs>()("@the-moby-effect/endpoints/Configs", {
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
        const ConfigsError = DockerError.WrapForModule("configs");
        const client = yield* HttpApiClient.group(ConfigsApi, { group: "configs", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters> | undefined) =>
            Effect.mapError(client.list({ urlParams: { filters } }), ConfigsError("list"));
        const create_ = (...config: ConstructorParameters<typeof SwarmConfigSpec>) =>
            Effect.mapError(client.create({ payload: SwarmConfigSpec.make(...config) }), ConfigsError("create"));
        const inspect_ = (identifier: ConfigIdentifier) =>
            Effect.mapError(client.inspect({ path: { identifier } }), ConfigsError("inspect"));
        const delete_ = (identifier: ConfigIdentifier) =>
            Effect.mapError(client.delete({ path: { identifier } }), ConfigsError("delete"));
        const update_ = (
            identifier: ConfigIdentifier,
            version: bigint,
            ...config: ConstructorParameters<typeof SwarmConfigSpec>
        ) =>
            Effect.mapError(
                client.update({
                    path: { identifier },
                    urlParams: { version },
                    payload: SwarmConfigSpec.make(...config),
                }),
                ConfigsError("update")
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
export const ConfigsLayerLocalSocket: Layer.Layer<Configs, never, HttpClient.HttpClient> = Configs.Default;

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export const ConfigsLayer: Layer.Layer<Configs, never, HttpClient.HttpClient> = Configs.DefaultWithoutDependencies;
