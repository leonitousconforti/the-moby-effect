import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpApiSchema, HttpClient } from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";
import { I64 } from "effect-schemas/Number";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    VolumeClusterVolumeSpec as ClusterVolumeSpec,
    VolumeVolume as Volume,
    VolumeCreateOptions,
} from "../generated/index.js";
import { VolumeIdentifier } from "../schemas/id.js";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound } from "./httpApiHacks.ts";
import { NodeNotPartOfSwarm } from "./swarm.js";

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        name: Schema.optional(Schema.Array(Schema.String)),
        driver: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        dangling: Schema.optional(Schema.Array(Schema.Literal("true", "false", "1", "0"))),
    })
) {}

/** @since 1.0.0 */
export class PruneFilters extends Schema.parseJson(
    Schema.Struct({
        label: Schema.optional(Schema.Array(Schema.String)),
        all: Schema.optional(Schema.Array(Schema.Literal("true", "false", "1", "0"))),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeList */
const listVolumesEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(ListFilters) }))
    .addSuccess(
        Schema.Struct({
            Volumes: Schema.Array(Volume),
            Warnings: Schema.optional(Schema.Array(Schema.String)),
        }),
        { status: 200 }
    ); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeCreate */
const createVolumeEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(VolumeCreateOptions)
    .addSuccess(Volume, { status: 201 }); // 201 Created

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeInspect */
const inspectVolumeEndpoint = HttpApiEndpoint.get("inspect", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(Volume, { status: 200 }) // 200 OK
    .addError(NotFound); // 404 Volume not found

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeDelete */
const deleteVolumeEndpoint = HttpApiEndpoint.del("delete", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(NotFound) // 404 Volume not found
    .addError(Conflict); // 409 Volume is in use

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeUpdate */
const updateVolumeEndpoint = HttpApiEndpoint.put("update", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ version: Schema.NumberFromString }))
    .setPayload(ClusterVolumeSpec)
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(BadRequest) // 400 Bad parameter
    .addError(NotFound) // 404 Volume not found
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumePrune */
const pruneVolumeEndpoint = HttpApiEndpoint.post("prune", "/prune")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(PruneFilters) }))
    .addSuccess(
        Schema.Struct({
            VolumesDeleted: Schema.optional(Schema.Array(VolumeIdentifier)),
            SpaceReclaimed: I64,
        }),
        { status: 200 }
    ); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume */
const VolumesGroup = HttpApiGroup.make("volumes")
    .add(listVolumesEndpoint)
    .add(createVolumeEndpoint)
    .add(inspectVolumeEndpoint)
    .add(deleteVolumeEndpoint)
    .add(updateVolumeEndpoint)
    .add(pruneVolumeEndpoint)
    .addError(InternalServerError)
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
export class Volumes extends Effect.Service<Volumes>()("@the-moby-effect/endpoints/Volumes", {
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
        const VolumesError = DockerError.WrapForModule("volumes");
        const client = yield* HttpApiClient.group(VolumesApi, { group: "volumes", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters>) =>
            Effect.mapError(client.list({ urlParams: { filters } }), VolumesError("list"));
        const create_ = (options: VolumeCreateOptions) =>
            Effect.mapError(client.create({ payload: options }), VolumesError("create"));
        const inspect_ = (name: string) => Effect.mapError(client.inspect({ path: { name } }), VolumesError("inspect"));
        const delete_ = (name: string, options?: { force?: boolean | undefined } | undefined) =>
            Effect.mapError(client.delete({ path: { name }, urlParams: { ...options } }), VolumesError("delete"));
        const update_ = (name: string, version: number, spec: ClusterVolumeSpec) =>
            Effect.mapError(
                client.update({ path: { name }, urlParams: { version }, payload: spec }),
                VolumesError("update")
            );
        const prune_ = (filters?: Schema.Schema.Type<PruneFilters>) =>
            Effect.mapError(client.prune({ urlParams: { filters } }), VolumesError("prune"));

        return {
            list: list_,
            create: create_,
            inspect: inspect_,
            delete: delete_,
            update: update_,
            prune: prune_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
 */
export const VolumesLayerLocalSocket: Layer.Layer<Volumes, never, HttpClient.HttpClient> = Volumes.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
 */
export const VolumesLayer: Layer.Layer<Volumes, never, HttpClient.HttpClient> = Volumes.DefaultWithoutDependencies;
