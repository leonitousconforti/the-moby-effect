import type * as HttpBody from "@effect/platform/HttpBody";
import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Layer from "effect/Layer";
import type * as ParseResult from "effect/ParseResult";

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Tuple from "effect/Tuple";

import { SwarmSecret, SwarmSecretCreateResponse, SwarmSecretSpec } from "../generated/index.js";
import { maybeAddQueryParameter } from "./common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SecretsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/SecretsError"
) as SecretsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export class Secrets extends Effect.Service<Secrets>()("@the-moby-effect/endpoints/Secrets", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretList */
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
                Effect.mapError((cause) => new SecretsError({ method: "list", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretCreate */
        const create_ = (
            data: typeof SwarmSecretSpec.Encoded
        ): Effect.Effect<Readonly<SwarmSecretCreateResponse>, SecretsError, never> =>
            Function.pipe(
                Schema.decode(SwarmSecretSpec)(data),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/secrets/create"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmSecretSpec))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmSecretCreateResponse)),
                Effect.mapError((cause) => new SecretsError({ method: "create", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretDelete */
        const delete_ = (id: string): Effect.Effect<void, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/secrets/${encodeURIComponent(id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new SecretsError({ method: "delete", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretInspect */
        const inspect_ = (id: string): Effect.Effect<Readonly<SwarmSecret>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/secrets/${encodeURIComponent(id)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmSecret)),
                Effect.mapError((cause) => new SecretsError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret/operation/SecretUpdate */
        const update_ = (
            id: string,
            options: {
                readonly spec: SwarmSecretSpec;
                readonly version: number;
            }
        ): Effect.Effect<void, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/secrets/${encodeURIComponent(id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBodyJson(SwarmSecretSpec)(options.spec),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new SecretsError({ method: "update", cause }))
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
 * Secrets are sensitive data that can be used by services. Swarm mode must be
 * enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Secret
 */
export const SecretsLayer: Layer.Layer<Secrets, never, HttpClient.HttpClient> = Secrets.Default;
