/**
 * Secrets service
 *
 * @since 1.0.0
 */

import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { addQueryParameter, responseErrorHandler } from "./Requests.js";
import { IDResponse, Secret, SecretSpec } from "./Schemas.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export class SecretsError extends Data.TaggedError("SecretsError")<{
    method: string;
    message: string;
}> {}

/** @since 1.0.0 */
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
     */
    readonly filters?: string;
}

/** @since 1.0.0 */
export interface SecretDeleteOptions {
    /** ID of the secret */
    readonly id: string;
}

/** @since 1.0.0 */
export interface SecretInspectOptions {
    /** ID of the secret */
    readonly id: string;
}

/** @since 1.0.0 */
export interface SecretUpdateOptions {
    /** The ID or name of the secret */
    readonly id: string;
    /**
     * The spec of the secret to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [SecretInspect
     * endpoint](#operation/SecretInspect) response values.
     */
    readonly spec: Schema.Schema.Encoded<typeof SecretSpec>;
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
export interface Secrets {
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
    readonly list: (options?: SecretListOptions | undefined) => Effect.Effect<Readonly<Array<Secret>>, SecretsError>;

    /**
     * Create a secret
     *
     * @param body -
     */
    readonly create: (
        options: Schema.Schema.Encoded<typeof SecretSpec>
    ) => Effect.Effect<Readonly<IDResponse>, SecretsError>;

    /**
     * Delete a secret
     *
     * @param id - ID of the secret
     */
    readonly delete: (options: SecretDeleteOptions) => Effect.Effect<void, SecretsError>;

    /**
     * Inspect a secret
     *
     * @param id - ID of the secret
     */
    readonly inspect: (options: SecretInspectOptions) => Effect.Effect<Readonly<Secret>, SecretsError>;

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
    readonly update: (options: SecretUpdateOptions) => Effect.Effect<void, SecretsError>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<Secrets, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* () {
        const agent = yield* MobyConnectionAgent;
        const defaultClient = yield* HttpClient.client.Client;

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/secrets`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const SecretClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Secret)));
        const IDResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(IDResponse))
        );
        const SecretsClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(Secret)))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new SecretsError({ method, message }));

        const list_ = (options?: SecretListOptions | undefined): Effect.Effect<Readonly<Array<Secret>>, SecretsError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", options?.filters),
                SecretsClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const create_ = (
            options: Schema.Schema.Encoded<typeof SecretSpec>
        ): Effect.Effect<Readonly<IDResponse>, SecretsError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                HttpClient.request.schemaBody(SecretSpec)(new SecretSpec(options)),
                Effect.flatMap(IDResponseClient),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const delete_ = (options: SecretDeleteOptions): Effect.Effect<void, SecretsError> =>
            Function.pipe(
                HttpClient.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const inspect_ = (options: SecretInspectOptions): Effect.Effect<Readonly<Secret>, SecretsError> =>
            Function.pipe(
                HttpClient.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                SecretClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const update_ = (options: SecretUpdateOptions): Effect.Effect<void, SecretsError> =>
            Function.pipe(
                HttpClient.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("version", options.version),
                HttpClient.request.schemaBody(SecretSpec)(new SecretSpec(options.spec)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_ };
    }
);

/**
 * Secrets service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Secrets: Context.Tag<Secrets, Secrets> = Context.GenericTag<Secrets>("@the-moby-effect/Secrets");

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