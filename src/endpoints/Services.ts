/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

import {
    SwarmService,
    SwarmServiceCreateResponse,
    SwarmServiceSpec,
    SwarmServiceUpdateResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const ServicesErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/ServicesError"
) as ServicesErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 * @internal
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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Services are the definitions of tasks to run on a swarm. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Service
 */
export class Services extends Effect.Service<Services>()("@the-moby-effect/endpoints/Services", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceList */
        const list_ = (
            options?: { readonly filters?: string; readonly status?: boolean } | undefined
        ): Effect.Effect<Readonly<Array<SwarmService>>, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.get("/services"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                maybeAddQueryParameter("status", Option.fromNullable(options?.status)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmService))),
                Effect.mapError((cause) => new ServicesError({ method: "list", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceCreate */
        const create_ = (options: {
            readonly body: typeof SwarmServiceSpec.Encoded;
            readonly "X-Registry-Auth"?: string;
        }): Effect.Effect<Readonly<SwarmServiceCreateResponse>, ServicesError, never> =>
            Function.pipe(
                Schema.decode(SwarmServiceSpec)(options.body),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/services/create"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmServiceSpec))),
                Effect.map(HttpClientRequest.setHeader("X-Registry-Auth", "")),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmServiceCreateResponse)),
                Effect.mapError((cause) => new ServicesError({ method: "create", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceDelete */
        const delete_ = (id: string): Effect.Effect<void, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/services/${encodeURIComponent(id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ServicesError({ method: "delete", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceInspect */
        const inspect_ = (
            id: string,
            options?:
                | {
                      readonly insertDefaults?: boolean;
                  }
                | undefined
        ): Effect.Effect<Readonly<SwarmService>, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/services/${encodeURIComponent(id)}`),
                maybeAddQueryParameter("insertDefaults", Option.fromNullable(options?.insertDefaults)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmService)),
                Effect.mapError((cause) => new ServicesError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceUpdate */
        const update_ = (
            id: string,
            options: {
                readonly body: SwarmServiceSpec;
                /**
                 * The version number of the service object being updated. This
                 * is required to avoid conflicting writes. This version number
                 * should be the value as currently set on the service _before_
                 * the update. You can find the current version by calling `GET
                 * /services/{id}`
                 */
                readonly version: number;
                /**
                 * If the `X-Registry-Auth` header is not specified, this
                 * parameter indicates where to find registry authorization
                 * credentials.
                 */
                readonly registryAuthFrom?: string;
                /**
                 * Set to this parameter to `previous` to cause a server-side
                 * rollback to the previous service spec. The supplied spec will
                 * be ignored in this case.
                 */
                readonly rollback?: string;
                /**
                 * A base64url-encoded auth configuration for pulling from
                 * private registries.
                 *
                 * Refer to the [authentication
                 * section](#section/Authentication) for details.
                 */
                readonly "X-Registry-Auth"?: string;
            }
        ): Effect.Effect<Readonly<SwarmServiceUpdateResponse>, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/services/${encodeURIComponent(id)}/update`),
                HttpClientRequest.setHeader("X-Registry-Auth", ""),
                maybeAddQueryParameter("version", Option.some(options.version)),
                maybeAddQueryParameter("registryAuthFrom", Option.fromNullable(options.registryAuthFrom)),
                maybeAddQueryParameter("rollback", Option.fromNullable(options.rollback)),
                HttpClientRequest.schemaBodyJson(SwarmServiceSpec)(options.body),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmServiceUpdateResponse)),
                Effect.mapError((cause) => new ServicesError({ method: "update", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Service/operation/ServiceLogs */
        const logs_ = (
            id: string,
            options?:
                | {
                      readonly details?: boolean;
                      readonly follow?: boolean;
                      readonly stdout?: boolean;
                      readonly stderr?: boolean;
                      readonly since?: number;
                      readonly timestamps?: boolean;
                      readonly tail?: string;
                  }
                | undefined
        ): Stream.Stream<string, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/services/${encodeURIComponent(id)}/logs`),
                maybeAddQueryParameter("details", Option.fromNullable(options?.details)),
                maybeAddQueryParameter("follow", Option.fromNullable(options?.follow)),
                maybeAddQueryParameter("stdout", Option.fromNullable(options?.stdout)),
                maybeAddQueryParameter("stderr", Option.fromNullable(options?.stderr)),
                maybeAddQueryParameter("since", Option.fromNullable(options?.since)),
                maybeAddQueryParameter("timestamps", Option.fromNullable(options?.timestamps)),
                maybeAddQueryParameter("tail", Option.fromNullable(options?.tail)),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapError((cause) => new ServicesError({ method: "logs", cause }))
            );

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
export const ServicesLayer: Layer.Layer<Services, never, HttpClient.HttpClient> = Services.Default;
