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
    ClusterVolumeSpec,
    Volume,
    VolumeCreateOptions,
    VolumeListResponse,
    VolumePruneResponse,
} from "../generated/index.js";

/**
 * Volume list filters (JSON encoded)
 *
 * @since 1.0.0
 */
export class VolumeListFilters extends Schema.parseJson(
    Schema.Struct({
        name: Schema.optional(Schema.Array(Schema.String)),
        driver: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        dangling: Schema.optional(Schema.Array(Schema.Literal("true", "false", "1", "0"))),
    })
) {}

/**
 * Volume prune filters (JSON encoded)
 *
 * @since 1.0.0
 */
export class VolumePruneFilters extends Schema.parseJson(
    Schema.Struct({
        label: Schema.optional(Schema.Array(Schema.String)),
        all: Schema.optional(Schema.Array(Schema.Literal("true", "false", "1", "0"))),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeList */
const listVolumesEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(
        Schema.Struct({
            filters: Schema.optional(VolumeListFilters),
        })
    )
    .addSuccess(VolumeListResponse, { status: 200 }); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeCreate */
const createVolumeEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(VolumeCreateOptions)
    .addSuccess(Volume, { status: 201 }) // 201 Created
    .addError(HttpApiError.Conflict); // 409 Name conflicts

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeInspect */
const inspectVolumeEndpoint = HttpApiEndpoint.get("inspect", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(Volume, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound); // 404 Volume not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeDelete */
const deleteVolumeEndpoint = HttpApiEndpoint.del("delete", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 Volume not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeUpdate */
const updateVolumeEndpoint = HttpApiEndpoint.put("update", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ version: Schema.NumberFromString }))
    .setPayload(ClusterVolumeSpec)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad parameter
    .addError(HttpApiError.NotFound); // 404 Volume not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumePrune */
const pruneVolumeEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(
        Schema.Struct({
            filters: Schema.optional(VolumePruneFilters),
        })
    )
    .addSuccess(VolumePruneResponse, { status: 200 }); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume */
const VolumesGroup = HttpApiGroup.make("volumes")
    .add(listVolumesEndpoint)
    .add(createVolumeEndpoint)
    .add(inspectVolumeEndpoint)
    .add(deleteVolumeEndpoint)
    .add(updateVolumeEndpoint)
    .add(pruneVolumeEndpoint)
    .addError(HttpApiError.InternalServerError) // 500 Server error
    .prefix("/volumes");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
 */
export const VolumesApi = HttpApi.make("VolumesApi").add(VolumesGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
 */
export class VolumesService extends Effect.Service<VolumesService>()("@the-moby-effect/endpoints/Volumes", {
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
        const client = yield* HttpApiClient.group(VolumesApi, { group: "volumes", httpClient });

        const list_ = (filters?: Schema.Schema.Type<VolumeListFilters> | undefined) =>
            client.list({ urlParams: { filters } });
        const create_ = (options: VolumeCreateOptions) => client.create({ payload: options });
        const inspect_ = (name: string) => client.inspect({ path: { name } });
        const delete_ = (name: string, force?: boolean) => client.delete({ path: { name }, urlParams: { force } });
        const update_ = (name: string, version: number, spec: ClusterVolumeSpec) =>
            client.update({ path: { name }, urlParams: { version }, payload: spec });
        const prune_ = (filters?: Schema.Schema.Type<VolumePruneFilters> | undefined) =>
            client.prune({ urlParams: { filters } });

        return {
            list: list_,
            create: create_,
            inspect: inspect_,
            delete: delete_,
            update: update_,
            prune: prune_,
        } as const;
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 */
export const VolumesLayerLocalSocket: Layer.Layer<VolumesService, never, HttpClient.HttpClient> =
    VolumesService.Default;

/**
 * @since 1.0.0
 * @category Layers
 */
export const VolumesLayer: Layer.Layer<VolumesService, never, HttpClient.HttpClient> =
    VolumesService.DefaultWithoutDependencies;
