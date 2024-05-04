import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import { IDResponse, Secret, SecretSpec } from "./schemas.js";

export class SecretsError extends Data.TaggedError("SecretsError")<{
    method: string;
    message: string;
}> {}

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

export interface SecretDeleteOptions {
    /** ID of the secret */
    readonly id: string;
}

export interface SecretInspectOptions {
    /** ID of the secret */
    readonly id: string;
}

export interface SecretUpdateOptions {
    /** The ID or name of the secret */
    readonly id: string;
    /**
     * The spec of the secret to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [SecretInspect
     * endpoint](#operation/SecretInspect) response values.
     */
    readonly spec: Schema.Schema.To<typeof SecretSpec.struct>;
    /**
     * The version number of the secret object being updated. This is required
     * to avoid conflicting writes.
     */
    readonly version: number;
}

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
    readonly list: (
        options?: SecretListOptions | undefined
    ) => Effect.Effect<Readonly<Array<Secret>>, SecretsError>;

    /**
     * Create a secret
     *
     * @param body -
     */
    readonly create: (
        options: Schema.Schema.To<typeof SecretSpec.struct>
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

const make: Effect.Effect<Secrets, never, IMobyConnectionAgent | NodeHttp.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/secrets`)),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        const SecretClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Secret)));
        const IDResponseClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(IDResponse)));
        const SecretsClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Secret)))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new SecretsError({ method, message }));

        const list_ = (
            options?: SecretListOptions | undefined
        ): Effect.Effect<Readonly<Array<Secret>>, SecretsError> =>
            Function.pipe(
                NodeHttp.request.get(""),
                addQueryParameter("filters", options?.filters),
                SecretsClient,
                Effect.catchAll(responseHandler("list"))
            );

        const create_ = (
            options: Schema.Schema.To<typeof SecretSpec.struct>
        ): Effect.Effect<Readonly<IDResponse>, SecretsError> =>
            Function.pipe(
                NodeHttp.request.post("/create"),
                NodeHttp.request.schemaBody(SecretSpec)(new SecretSpec(options)),
                Effect.flatMap(IDResponseClient),
                Effect.catchAll(responseHandler("create"))
            );

        const delete_ = (options: SecretDeleteOptions): Effect.Effect<void, SecretsError> =>
            Function.pipe(
                NodeHttp.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete"))
            );

        const inspect_ = (options: SecretInspectOptions): Effect.Effect<Readonly<Secret>, SecretsError> =>
            Function.pipe(
                NodeHttp.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                SecretClient,
                Effect.catchAll(responseHandler("inspect"))
            );

        const update_ = (options: SecretUpdateOptions): Effect.Effect<void, SecretsError> =>
            Function.pipe(
                NodeHttp.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("version", options.version),
                NodeHttp.request.schemaBody(SecretSpec)(new SecretSpec(options.spec)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update"))
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_ };
    }
);

export const Secrets = Context.GenericTag<Secrets>("the-moby-effect/Secrets");
export const layer = Layer.effect(Secrets, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
