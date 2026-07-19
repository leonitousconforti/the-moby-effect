import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmService, SwarmServiceSpec } from "../generated/index.js";
import { ServiceIdentifier } from "../schemas/id.js";
import { WithRegistryAuthHeader } from "./auth.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, Forbidden, InternalServerError, NotFound, ServiceUnavailable } from "./errors.ts";
import { HttpApiStreamingResponse } from "./httpApiHacks.js";

/** @since 1.0.0 */
export const ListFilters = Schema.fromJsonString(
    Schema.Struct({
        id: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        mode: Schema.optional(Schema.Array(Schema.Literals(["replicated", "global"]))),
    })
);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceList */
const listServicesEndpoint = HttpApiEndpoint.get("list", "/", {
    query: {
        filters: Schema.optional(ListFilters),
        status: Schema.optional(Schema.Boolean),
    },
    success: Schema.Array(SwarmService), // 200 OK
    error: [
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceCreate */
const createServiceEndpoint = HttpApiEndpoint.post("create", "/create", {
    payload: SwarmServiceSpec,
    headers: { "X-Registry-Auth": Schema.optional(Schema.String) },
    success: Schema.Struct({
        ID: ServiceIdentifier,
        Warnings: Schema.optional(Schema.Array(Schema.String)),
    }).pipe(HttpApiSchema.status(201)), // 201 Created
    error: [
        BadRequest, // 400 Bad request
        Forbidden, // 403 network is not eligible for services
        Conflict, // 409 name conflicts with an existing object
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceDelete */
const deleteServiceEndpoint = HttpApiEndpoint.delete("delete", "/:id", {
    params: { id: Schema.String },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NotFound, // 404 No such service
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceInspect */
const inspectServiceEndpoint = HttpApiEndpoint.get("inspect", "/:id", {
    params: { id: Schema.String },
    query: { insertDefaults: Schema.optional(Schema.Boolean) },
    success: SwarmService, // 200 OK
    error: [
        NotFound, // 404 No such service
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceUpdate */
const updateServiceEndpoint = HttpApiEndpoint.post("update", "/:id/update", {
    params: { id: Schema.String },
    query: {
        version: Schema.Number,
        rollback: Schema.optional(Schema.String),
        registryAuthFrom: Schema.optional(Schema.String),
    },
    headers: { "X-Registry-Auth": Schema.optional(Schema.String) },
    payload: SwarmServiceSpec,
    success: Schema.Struct({ Warnings: Schema.optional(Schema.Array(Schema.String)) }), // 200 OK
    error: [
        BadRequest, // 400 Bad request
        NotFound, // 404 No such service
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceLogs */
const logsServiceEndpoint = HttpApiEndpoint.get("logs", "/:id/logs", {
    params: { id: Schema.String },
    query: {
        details: Schema.optional(Schema.Boolean),
        follow: Schema.optional(Schema.Boolean),
        stdout: Schema.optional(Schema.Boolean),
        stderr: Schema.optional(Schema.Boolean),
        since: Schema.optional(Schema.Number),
        timestamps: Schema.optional(Schema.Boolean),
        tail: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 No such service
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service */
const ServicesGroup = HttpApiGroup.make("services")
    .add(
        listServicesEndpoint,
        createServiceEndpoint,
        deleteServiceEndpoint,
        inspectServiceEndpoint,
        updateServiceEndpoint,
        logsServiceEndpoint
    )
    .prefix("/services");

/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */
export const ServicesApi = HttpApi.make("ServicesApi").add(ServicesGroup);

/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */
export class Services extends Context.Service<Services>()("@the-moby-effect/endpoints/Services", {
    make: Effect.gen(function* () {
        type ServicesEndpoints = HttpApiGroup.Endpoints<typeof ServicesGroup>;
        type Options<Name extends ServicesEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            ServicesEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* Effect.map(
            HttpClient.HttpClient,
            WithRegistryAuthHeader(createServiceEndpoint, updateServiceEndpoint)
        );

        const ServicesError = DockerError.WrapForModule("services");
        const client = yield* HttpApiClient.group(ServicesApi, { group: "services", httpClient });

        const list_ = (options?: Options<"list">) =>
            Effect.mapError(client.list({ query: { ...options } }), ServicesError("list"));
        const create_ = (...payload: ConstructorParameters<typeof SwarmServiceSpec>) =>
            Effect.mapError(
                client.create({
                    headers: {},
                    payload: new SwarmServiceSpec(...payload),
                }),
                ServicesError("create")
            );
        const delete_ = (id: string) => Effect.mapError(client.delete({ params: { id } }), ServicesError("delete"));
        const inspect_ = (id: string, options?: Options<"inspect">) =>
            Effect.mapError(client.inspect({ params: { id }, query: { ...options } }), ServicesError("inspect"));
        const update_ = (
            id: string,
            options: Options<"update">,
            ...payload: ConstructorParameters<typeof SwarmServiceSpec>
        ) =>
            Effect.mapError(
                client.update({
                    headers: {},
                    params: { id },
                    query: { ...options },
                    payload: new SwarmServiceSpec(...payload),
                }),
                ServicesError("update")
            );
        const logs_ = (id: string, options?: Options<"logs">) =>
            HttpApiStreamingResponse(
                ServicesApi,
                "services",
                "logs",
                httpClient
            )({ params: { id }, query: { ...options } })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapError(ServicesError("logs")));

        return {
            list: list_,
            create: create_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
            logs: logs_,
        };
    }),
}) {}

/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */
export const ServicesLayer: Layer.Layer<Services, never, HttpClient.HttpClient> = Layer.effect(Services, Services.make);

/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */
export const ServicesLayerLocalSocket: Layer.Layer<Services, never, HttpClient.HttpClient> = ServicesLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
