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
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "../Agent.js";
import { maybeAddQueryParameter } from "../Requests.js";
import { IdResponse, Secret, SecretSpec } from "../Schemas.js";

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
export class SecretsError extends PlatformError.RefailError(SecretsErrorTypeId, "SecretsError")<{
    method: string;
    error: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}: ${super.message}`;
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
    readonly spec: SecretSpec;
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
    ) => Effect.Effect<Readonly<Array<Secret>>, SecretsError, never>;

    /**
     * Create a secret
     *
     * @param body -
     */
    readonly create: (options: SecretSpec) => Effect.Effect<Readonly<IdResponse>, SecretsError, never>;

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
    readonly inspect: (options: SecretInspectOptions) => Effect.Effect<Readonly<Secret>, SecretsError, never>;

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
export const make: Effect.Effect<SecretsImpl, never, IMobyConnectionAgent | HttpClient.HttpClient.Default> = Effect.gen(
    function* () {
        const agent = yield* MobyConnectionAgent;
        const defaultClient = yield* HttpClient.HttpClient;

        const client = defaultClient.pipe(
            HttpClient.mapRequest(HttpClientRequest.prependUrl(`${agent.nodeRequestUrl}/secrets`)),
            HttpClient.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
        const SecretClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Secret)));
        const IdResponseClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(IdResponse)));
        const SecretsClient = client.pipe(
            HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(Secret)))
        );

        const list_ = (
            options?: SecretListOptions | undefined
        ): Effect.Effect<Readonly<Array<Secret>>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.get(""),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                SecretsClient,
                Effect.mapError((error) => new SecretsError({ method: "list", error })),
                Effect.scoped
            );

        const create_ = (options: SecretSpec): Effect.Effect<Readonly<IdResponse>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/create"),
                HttpClientRequest.schemaBody(SecretSpec)(options),
                Effect.flatMap(IdResponseClient),
                Effect.mapError((error) => new SecretsError({ method: "create", error })),
                Effect.scoped
            );

        const delete_ = (options: SecretDeleteOptions): Effect.Effect<void, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/${encodeURIComponent(options.id)}`),
                voidClient,
                Effect.mapError((error) => new SecretsError({ method: "delete", error })),
                Effect.scoped
            );

        const inspect_ = (options: SecretInspectOptions): Effect.Effect<Readonly<Secret>, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/${encodeURIComponent(options.id)}`),
                SecretClient,
                Effect.mapError((error) => new SecretsError({ method: "inspect", error })),
                Effect.scoped
            );

        const update_ = (options: SecretUpdateOptions): Effect.Effect<void, SecretsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/${encodeURIComponent(options.id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBody(SecretSpec)(options.spec),
                Effect.flatMap(voidClient),
                Effect.mapError((error) => new SecretsError({ method: "update", error })),
                Effect.scoped
            );

        return {
            list: list_,
            create: create_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
        };
    }
);

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
export const layer: Layer.Layer<Secrets, never, IMobyConnectionAgent> = Layer.effect(Secrets, make).pipe(
    Layer.provide(MobyHttpClientLive)
);

/**
 * Constructs a layer from an agent effect
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromAgent = (
    agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
): Layer.Layer<Secrets, never, Scope.Scope> => layer.pipe(Layer.provide(Layer.effect(MobyConnectionAgent, agent)));

/**
 * Constructs a layer from agent connection options
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromConnectionOptions = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Secrets, never, Scope.Scope> => fromAgent(getAgent(connectionOptions));
