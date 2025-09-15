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
import { SwarmConfig, SwarmConfigCreateResponse, SwarmConfigSpec } from "../generated/index.js";
import { ConfigId } from "../schemas/id.js";

/** @since 1.0.0 */
export class NodeNotPartOfSwarm extends HttpApiSchema.EmptyError<NodeNotPartOfSwarm>()({
    tag: "NodeNotPartOfSwarm",
    status: 503,
}) {}

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        id: Schema.optional(Schema.Array(Schema.String)),
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
    .addSuccess(SwarmConfigCreateResponse, { status: 201 }) // 201 Created
    .addError(HttpApiError.Conflict); // 409 Name conflicts

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigInspect */
const inspectConfigEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: ConfigId }))
    .addSuccess(SwarmConfig, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Config not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigDelete */
const deleteConfigEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: ConfigId }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Config not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigUpdate */
const updateConfigEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ id: ConfigId }))
    .setUrlParams(Schema.Struct({ version: Schema.NumberFromString }))
    .setPayload(SwarmConfigSpec) // Note: Docker API states only Labels can be updated
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK, no response body
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Config not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config */
const ConfigsGroup = HttpApiGroup.make("configs")
    .add(listConfigsEndpoint)
    .add(createConfigEndpoint)
    .add(inspectConfigEndpoint)
    .add(deleteConfigEndpoint)
    .add(updateConfigEndpoint)
    .addError(HttpApiError.InternalServerError) // 500 Server error
    .addError(NodeNotPartOfSwarm) // 503 Node not part of swarm
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
export class ConfigsService extends Effect.Service<ConfigsService>()("@the-moby-effect/endpoints/Configs", {
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
        const client = yield* HttpApiClient.group(ConfigsApi, { group: "configs", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters> | undefined) =>
            client.list({ urlParams: { filters } });
        const create_ = (config: SwarmConfigSpec) => client.create({ payload: config });
        const inspect_ = (id: ConfigId) => client.inspect({ path: { id } });
        const delete_ = (id: ConfigId) => client.delete({ path: { id } });
        const update_ = (id: ConfigId, version: number, config: SwarmConfigSpec) =>
            client.update({ path: { id }, urlParams: { version }, payload: config });

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
export const ConfigsLayerLocalSocket: Layer.Layer<ConfigsService, never, HttpClient.HttpClient> =
    ConfigsService.Default;

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export const ConfigsLayer: Layer.Layer<ConfigsService, never, HttpClient.HttpClient> =
    ConfigsService.DefaultWithoutDependencies;
