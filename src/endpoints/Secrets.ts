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
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";

import { IDResponse, SwarmSecret, SwarmSecretSpec } from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SecretsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/SecretsError");

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface SecretListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the secrets list.
     *
     * Available filters:
     *
     * - `id=<secret id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<secret name>`
     * - `names=<secret name>`
     *
     * FIXME: implement this type
     */
    readonly filters?: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface SecretDeleteOptions {
    /** ID of the secret */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface SecretInspectOptions {
    /** ID of the secret */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface SecretUpdateOptions {
    /** The ID or name of the secret */
    readonly id: string;
    /**
     * The spec of the secret to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [SecretInspect
     * endpoint](#operation/SecretInspect) response values.
     */
    readonly spec: SwarmSecretSpec;
    /**
     * The version number of the secret object being updated. This is required
     * to avoid conflicting writes.
     */
    readonly version: number;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface SecretsImpl {
    /**
     * List secrets
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the secrets list.
     *
     *   Available filters:
     *
     *   - `id=<secret id>`
     *   - `label=<key> or label=<key>=value`
     *   - `name=<secret name>`
     *   - `names=<secret name>`
     */
    readonly list: (
        options?: SecretListOptions | undefined
    ) => Effect.Effect<Readonly<Array<SwarmSecret>>, SecretsError, never>;

    /**
     * Create a secret
     *
     * @param body -
     */
    readonly create: (options: SwarmSecretSpec) => Effect.Effect<Readonly<IDResponse>, SecretsError, never>;

    /**
     * Delete a secret
     *
     * @param id - ID of the secret
     */
    readonly delete: (options: SecretDeleteOptions) => Effect.Effect<void, SecretsError, never>;

    /**
     * Inspect a secret
     *
     * @param id - ID of the secret
     */
    readonly inspect: (options: SecretInspectOptions) => Effect.Effect<Readonly<SwarmSecret>, SecretsError, never>;

    /**
     * Update a Secret
     *
     * @param id - The ID or name of the secret
     * @param spec - The spec of the secret to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [SecretInspect endpoint](#operation/SecretInspect) response
     *   values.
     * @param version - The version number of the secret object being updated.
     *   This is required to avoid conflicting writes.
     */
    readonly update: (options: SecretUpdateOptions) => Effect.Effect<void, SecretsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<SecretsImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/secrets")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const SecretClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SwarmSecret)));
    const IdResponseClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(IDResponse)));
    const SecretsClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmSecret)))
    );

    const list_ = (
        options?: SecretListOptions | undefined
    ): Effect.Effect<Readonly<Array<SwarmSecret>>, SecretsError, never> =>
        Function.pipe(
            HttpClientRequest.get(""),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            SecretsClient,
            Effect.mapError((cause) => new SecretsError({ method: "list", cause })),
            Effect.scoped
        );

    const create_ = (options: SwarmSecretSpec): Effect.Effect<Readonly<IDResponse>, SecretsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/create"),
            HttpClientRequest.schemaBody(SwarmSecretSpec)(options),
            Effect.flatMap(IdResponseClient),
            Effect.mapError((cause) => new SecretsError({ method: "create", cause })),
            Effect.scoped
        );

    const delete_ = (options: SecretDeleteOptions): Effect.Effect<void, SecretsError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/${encodeURIComponent(options.id)}`),
            voidClient,
            Effect.mapError((cause) => new SecretsError({ method: "delete", cause })),
            Effect.scoped
        );

    const inspect_ = (options: SecretInspectOptions): Effect.Effect<Readonly<SwarmSecret>, SecretsError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}`),
            SecretClient,
            Effect.mapError((cause) => new SecretsError({ method: "inspect", cause })),
            Effect.scoped
        );

    const update_ = (options: SecretUpdateOptions): Effect.Effect<void, SecretsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.id)}/update`),
            maybeAddQueryParameter("version", Option.some(options.version)),
            HttpClientRequest.schemaBody(SwarmSecretSpec)(options.spec),
            Effect.flatMap(voidClient),
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
});

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Secrets {
    readonly _: unique symbol;
}

/**
 * Secrets service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Secrets: Context.Tag<Secrets, SecretsImpl> = Context.GenericTag<Secrets, SecretsImpl>(
    "@the-moby-effect/moby/Secrets"
);

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Secrets, never, HttpClient.HttpClient.Default> = Layer.effect(Secrets, make);
