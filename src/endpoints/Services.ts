/**
 * Services service
 *
 * @since 1.0.0
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
export const ServicesErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/ServicesError");

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Services service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Services extends Effect.Service<Services>()("@the-moby-effect/endpoints/Services", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

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
                Effect.mapError((cause) => new ServicesError({ method: "list", cause })),
                Effect.scoped
            );

        const create_ = (options: {
            readonly body: SwarmServiceSpec;
            readonly "X-Registry-Auth"?: string;
        }): Effect.Effect<Readonly<SwarmServiceCreateResponse>, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.post("/services/create"),
                HttpClientRequest.setHeader("X-Registry-Auth", ""),
                HttpClientRequest.schemaBodyJson(SwarmServiceSpec)(options.body),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmServiceCreateResponse)),
                Effect.mapError((cause) => new ServicesError({ method: "create", cause })),
                Effect.scoped
            );

        const delete_ = (options: { readonly id: string }): Effect.Effect<void, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/services/${encodeURIComponent(options.id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ServicesError({ method: "delete", cause })),
                Effect.scoped
            );

        const inspect_ = (options: {
            readonly id: string;
            readonly insertDefaults?: boolean;
        }): Effect.Effect<Readonly<SwarmService>, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/services/${encodeURIComponent(options.id)}`),
                maybeAddQueryParameter("insertDefaults", Option.fromNullable(options.insertDefaults)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmService)),
                Effect.mapError((cause) => new ServicesError({ method: "inspect", cause })),
                Effect.scoped
            );

        const update_ = (options: {
            readonly id: string;
            readonly body: SwarmServiceSpec;
            /**
             * The version number of the service object being updated. This is
             * required to avoid conflicting writes. This version number should
             * be the value as currently set on the service _before_ the update.
             * You can find the current version by calling `GET /services/{id}`
             */
            readonly version: number;
            /**
             * If the `X-Registry-Auth` header is not specified, this parameter
             * indicates where to find registry authorization credentials.
             */
            readonly registryAuthFrom?: string;
            /**
             * Set to this parameter to `previous` to cause a server-side
             * rollback to the previous service spec. The supplied spec will be
             * ignored in this case.
             */
            readonly rollback?: string;
            /**
             * A base64url-encoded auth configuration for pulling from private
             * registries.
             *
             * Refer to the [authentication section](#section/Authentication)
             * for details.
             */
            readonly "X-Registry-Auth"?: string;
        }): Effect.Effect<Readonly<SwarmServiceUpdateResponse>, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/services/${encodeURIComponent(options.id)}/update`),
                HttpClientRequest.setHeader("X-Registry-Auth", ""),
                maybeAddQueryParameter("version", Option.some(options.version)),
                maybeAddQueryParameter("registryAuthFrom", Option.fromNullable(options.registryAuthFrom)),
                maybeAddQueryParameter("rollback", Option.fromNullable(options.rollback)),
                HttpClientRequest.schemaBodyJson(SwarmServiceSpec)(options.body),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmServiceUpdateResponse)),
                Effect.mapError((cause) => new ServicesError({ method: "update", cause })),
                Effect.scoped
            );

        const logs_ = (options: {
            readonly id: string;
            readonly details?: boolean;
            readonly follow?: boolean;
            readonly stdout?: boolean;
            readonly stderr?: boolean;
            readonly since?: number;
            readonly timestamps?: boolean;
            readonly tail?: string;
        }): Stream.Stream<string, ServicesError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/services/${encodeURIComponent(options.id)}/logs`),
                maybeAddQueryParameter("details", Option.fromNullable(options.details)),
                maybeAddQueryParameter("follow", Option.fromNullable(options.follow)),
                maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
                maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
                maybeAddQueryParameter("since", Option.fromNullable(options.since)),
                maybeAddQueryParameter("timestamps", Option.fromNullable(options.timestamps)),
                maybeAddQueryParameter("tail", Option.fromNullable(options.tail)),
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
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const ServicesLayer: Layer.Layer<Services, never, HttpClient.HttpClient> = Services.Default;
