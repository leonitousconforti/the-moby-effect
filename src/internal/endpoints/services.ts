import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    Error as PlatformError,
    type HttpClientError,
} from "@effect/platform";
import { Effect, Predicate, Schema, Stream, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmService, SwarmServiceSpec } from "../generated/index.js";
import { ServiceIdentifier } from "../schemas/id.js";
import { HttpApiStreamingResponse } from "./httpApiHacks.js";
import { NodeNotPartOfSwarm } from "./swarm.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ServicesErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/ServicesError"
) as ServicesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type ServicesErrorTypeId = typeof ServicesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isServicesError = (u: unknown): u is ServicesError => Predicate.hasProperty(u, ServicesErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ServicesError extends PlatformError.TypeIdError(ServicesErrorTypeId, "ServicesError")<{
    method: string;
    cause:
        | NodeNotPartOfSwarm
        | HttpApiError.InternalServerError
        | HttpApiError.BadRequest
        | HttpApiError.NotFound
        | HttpApiError.Forbidden
        | HttpApiError.Conflict
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: ServicesError["cause"]) => new this({ method, cause });
    }
}

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        id: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
        mode: Schema.optional(Schema.Array(Schema.Literal("replicated", "global"))),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceList */
const listServicesEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(
        Schema.Struct({
            filters: Schema.optional(ListFilters),
            status: Schema.optional(Schema.BooleanFromString),
        })
    )
    .addSuccess(Schema.Array(SwarmService), { status: 200 }) // 200 OK
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceCreate */
const createServiceEndpoint = HttpApiEndpoint.post("create", "/create")
    .setPayload(SwarmServiceSpec)
    .setHeaders(Schema.Struct({ "X-Registry-Auth": Schema.optional(Schema.String) }))
    .addSuccess(
        Schema.Struct({
            ID: ServiceIdentifier,
            Warnings: Schema.optional(Schema.Array(Schema.String)),
        }),
        { status: 201 }
    ) // 201 Created
    .addError(HttpApiError.BadRequest) // 400 Bad request
    .addError(HttpApiError.Forbidden) // 403 network is not eligible for services
    .addError(HttpApiError.Conflict) // 409 name conflicts with an existing object
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceDelete */
const deleteServiceEndpoint = HttpApiEndpoint.del("delete", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound) // 404 No such service
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceInspect */
const inspectServiceEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(Schema.Struct({ insertDefaults: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(SwarmService, { status: 200 }) // 200 OK
    .addError(HttpApiError.NotFound) // 404 No such service
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceUpdate */
const updateServiceEndpoint = HttpApiEndpoint.post("update", "/:id/update")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(
        Schema.Struct({
            version: Schema.NumberFromString,
            rollback: Schema.optional(Schema.String),
            registryAuthFrom: Schema.optional(Schema.String),
        })
    )
    .setHeaders(
        Schema.Struct({
            "X-Registry-Auth": Schema.optional(Schema.String),
        })
    )
    .setPayload(SwarmServiceSpec)
    .addSuccess(Schema.Struct({ Warnings: Schema.optional(Schema.Array(Schema.String)) }), { status: 200 }) // 200 OK
    .addError(HttpApiError.BadRequest) // 400 Bad request
    .addError(HttpApiError.NotFound) // 404 No such service
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceLogs */
const logsServiceEndpoint = HttpApiEndpoint.get("logs", "/:id/logs")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(
        Schema.Struct({
            details: Schema.optional(Schema.BooleanFromString),
            follow: Schema.optional(Schema.BooleanFromString),
            stdout: Schema.optional(Schema.BooleanFromString),
            stderr: Schema.optional(Schema.BooleanFromString),
            since: Schema.optional(Schema.NumberFromString),
            timestamps: Schema.optional(Schema.BooleanFromString),
            tail: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound) // 404 No such service
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service */
const ServicesGroup = HttpApiGroup.make("services")
    .add(listServicesEndpoint)
    .add(createServiceEndpoint)
    .add(deleteServiceEndpoint)
    .add(inspectServiceEndpoint)
    .add(updateServiceEndpoint)
    .add(logsServiceEndpoint)
    .addError(HttpApiError.InternalServerError)
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
export class Services extends Effect.Service<Services>()("@the-moby-effect/endpoints/Services", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof ServicesGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof ServicesGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(ServicesApi, { group: "services", httpClient });

        const list_ = (options?: Options<"list">) =>
            Effect.mapError(client.list({ urlParams: { ...options } }), ServicesError.WrapForMethod("list"));
        const create_ = (payload: SwarmServiceSpec) =>
            Effect.mapError(
                client.create({ payload, headers: { "X-Registry-Auth": "" } }),
                ServicesError.WrapForMethod("create")
            );
        const delete_ = (id: string) =>
            Effect.mapError(client.delete({ path: { id } }), ServicesError.WrapForMethod("delete"));
        const inspect_ = (id: string, options?: Options<"inspect">) =>
            Effect.mapError(
                client.inspect({ path: { id }, urlParams: { ...options } }),
                ServicesError.WrapForMethod("inspect")
            );
        const update_ = (id: string, payload: SwarmServiceSpec, options: Options<"update">) =>
            Effect.mapError(
                client.update({
                    payload,
                    path: { id },
                    urlParams: { ...options },
                    headers: { "X-Registry-Auth": "" },
                }),
                ServicesError.WrapForMethod("update")
            );
        const logs_ = (id: string, options?: Options<"logs">) =>
            HttpApiStreamingResponse(
                ServicesApi,
                "services",
                "logs",
                httpClient
            )({ path: { id }, urlParams: { ...options } })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapError(ServicesError.WrapForMethod("logs")));

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
export const ServicesLayerLocalSocket: Layer.Layer<Services, never, HttpClient.HttpClient> = Services.Default;

/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */
export const ServicesLayer: Layer.Layer<Services, never, HttpClient.HttpClient> = Services.DefaultWithoutDependencies;
