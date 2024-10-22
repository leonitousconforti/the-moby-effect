/**
 * Secrets service
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

import { SwarmSecret, SwarmSecretCreateResponse, SwarmSecretSpec } from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const SecretsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/SecretsError");

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export type SecretsErrorTypeId = typeof SecretsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isSecretsError = (u: unknown): u is SecretsError => Predicate.hasProperty(u, SecretsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class SecretsError extends PlatformError.TypeIdError(SecretsErrorTypeId, "SecretsError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Secrets service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Secrets extends Effect.Service<Secrets>()("@the-moby-effect/endpoints/Secrets", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        const list_ = (
            options?: { readonly filters?: Record<string, string | Array<string>> } | undefined
        ): Effect.Effect<Readonly<Array<SwarmSecret>>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/secrets"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmSecret))),
                Effect.mapError((cause) => new SecretsError({ method: "list", cause })),
                Effect.scoped
            );

        const create_ = (
            options: SwarmSecretSpec
        ): Effect.Effect<Readonly<SwarmSecretCreateResponse>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/secrets/create"),
                HttpClientRequest.schemaBodyJson(SwarmSecretSpec)(options),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmSecretCreateResponse)),
                Effect.mapError((cause) => new SecretsError({ method: "create", cause })),
                Effect.scoped
            );

        const delete_ = (options: { readonly id: string }): Effect.Effect<void, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/secrets/${encodeURIComponent(options.id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new SecretsError({ method: "delete", cause })),
                Effect.scoped
            );

        const inspect_ = (options: {
            readonly id: string;
        }): Effect.Effect<Readonly<SwarmSecret>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/secrets/${encodeURIComponent(options.id)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmSecret)),
                Effect.mapError((cause) => new SecretsError({ method: "inspect", cause })),
                Effect.scoped
            );

        const update_ = (options: {
            readonly id: string;
            readonly spec: SwarmSecretSpec;
            readonly version: number;
        }): Effect.Effect<void, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/secrets/${encodeURIComponent(options.id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBodyJson(SwarmSecretSpec)(options.spec),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new SecretsError({ method: "update", cause })),
                Effect.scoped
            );

        return {
            list: list_,
            create: create_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
        };
    }),
}) {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const SecretsLayer: Layer.Layer<Secrets, never, HttpClient.HttpClient> = Secrets.Default;
