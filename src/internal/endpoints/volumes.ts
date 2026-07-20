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
import {
    VolumeClusterVolumeSpec as ClusterVolumeSpec,
    VolumeVolume as Volume,
    VolumeCreateOptions,
} from "../generated/index.ts";
import { VolumeIdentifier } from "../schemas/id.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound, ServiceUnavailable } from "./errors.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.Struct({
    name: Schema.optional(Schema.Array(Schema.String)),
    driver: Schema.optional(Schema.Array(Schema.String)),
    label: Schema.optional(Schema.Array(Schema.String)),
    dangling: Schema.optional(Schema.Array(Schema.Literals(["true", "false", "1", "0"]))),
});

/** @since 1.0.0 */
export const PruneFilters = Schema.Struct({
    label: Schema.optional(Schema.Array(Schema.String)),
    all: Schema.optional(Schema.Array(Schema.Literals(["true", "false", "1", "0"]))),
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeList */
const listVolumesEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(ListFilters) },
    success: Schema.Struct({
        Volumes: Schema.Array(Volume),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    }), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeCreate */
const createVolumeEndpoint = HttpApiEndpoint.post("create", "/create", {
    payload: VolumeCreateOptions,
    success: Volume.pipe(HttpApiSchema.status(201)), // 201 Created
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeInspect */
const inspectVolumeEndpoint = HttpApiEndpoint.get("inspect", "/:name", {
    params: { name: Schema.String },
    success: Volume, // 200 OK
    error: [
        NotFound, // 404 Volume not found
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeDelete */
const deleteVolumeEndpoint = HttpApiEndpoint.delete("delete", "/:name", {
    params: { name: Schema.String },
    query: { force: Schema.optional(Schema.Boolean) },
    success: HttpApiSchema.NoContent, // 204 No Content
    error: [
        NotFound, // 404 Volume not found
        Conflict, // 409 Volume is in use
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumeUpdate */
const updateVolumeEndpoint = HttpApiEndpoint.put("update", "/:name", {
    params: { name: Schema.String },
    query: { version: Schema.Number },
    payload: ClusterVolumeSpec,
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Bad parameter
        NotFound, // 404 Volume not found
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume/operation/VolumePrune */
const pruneVolumeEndpoint = HttpApiEndpoint.post("prune", "/prune", {
    query: { filters: Schema.optional(PruneFilters) },
    success: Schema.Struct({
        VolumesDeleted: Schema.optional(Schema.Array(VolumeIdentifier)),
        SpaceReclaimed: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    }), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume */
const VolumesGroup = HttpApiGroup.make("volumes")
    .add(
        listVolumesEndpoint,
        createVolumeEndpoint,
        inspectVolumeEndpoint,
        deleteVolumeEndpoint,
        updateVolumeEndpoint,
        pruneVolumeEndpoint
    )
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
export class Volumes extends Context.Service<Volumes>()("@the-moby-effect/endpoints/Volumes", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const VolumesError = DockerError.WrapForModule("volumes");
        const client = yield* HttpApiClient.group(VolumesApi, { group: "volumes", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof ListFilters>) =>
            Effect.mapError(client.list({ query: { filters } }), VolumesError("list"));
        const create_ = (options: (typeof VolumeCreateOptions)["~type.make.in"]) =>
            Effect.mapError(client.create({ payload: VolumeCreateOptions.make(options) }), VolumesError("create"));
        const inspect_ = (name: string) =>
            Effect.mapError(client.inspect({ params: { name } }), VolumesError("inspect"));
        const delete_ = (name: string, options?: { force?: boolean | undefined } | undefined) =>
            Effect.mapError(client.delete({ params: { name }, query: { ...options } }), VolumesError("delete"));
        const update_ = (name: string, version: number, spec: (typeof ClusterVolumeSpec)["~type.make.in"]) =>
            Effect.mapError(
                client.update({ params: { name }, query: { version }, payload: ClusterVolumeSpec.make(spec) }),
                VolumesError("update")
            );
        const prune_ = (filters?: Schema.Schema.Type<typeof PruneFilters>) =>
            Effect.mapError(client.prune({ query: { filters } }), VolumesError("prune"));

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
export const VolumesLayer: Layer.Layer<Volumes, never, HttpClient.HttpClient> = Layer.effect(Volumes, Volumes.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Volume
 */
export const VolumesLayerLocalSocket: Layer.Layer<Volumes, never, HttpClient.HttpClient> = VolumesLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
