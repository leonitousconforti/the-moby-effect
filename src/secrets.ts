import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, errorHandler, setBody } from "./request-helpers.js";
import { IdResponse, IdResponseSchema, Secret, SecretSchema, SecretSpec, SecretsCreateBody } from "./schemas.js";

export class SecretCreateError extends Data.TaggedError("SecretCreateError")<{ message: string }> {}
export class SecretDeleteError extends Data.TaggedError("SecretDeleteError")<{ message: string }> {}
export class SecretInspectError extends Data.TaggedError("SecretInspectError")<{ message: string }> {}
export class SecretListError extends Data.TaggedError("SecretListError")<{ message: string }> {}
export class SecretUpdateError extends Data.TaggedError("SecretUpdateError")<{ message: string }> {}

export interface secretCreateOptions {
    body?: SecretsCreateBody;
}

export interface secretDeleteOptions {
    /** ID of the secret */
    id: string;
}

export interface secretInspectOptions {
    /** ID of the secret */
    id: string;
}

export interface secretListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the secrets list. Available filters:
     *
     * - `id=<secret id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<secret name>`
     * - `names=<secret name>`
     */
    filters?: string;
}

export interface secretUpdateOptions {
    /** The ID or name of the secret */
    id: string;
    /**
     * The version number of the secret object being updated. This is required
     * to avoid conflicting writes.
     */
    version: number;
    /**
     * The spec of the secret to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [SecretInspect
     * endpoint](#operation/SecretInspect) response values.
     */
    body?: SecretSpec;
}

/**
 * Create a secret
 *
 * @param body -
 */
export const secretCreate = (
    options: secretCreateOptions
): Effect.Effect<IMobyConnectionAgent, SecretCreateError, Readonly<IdResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SecretsCreateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IdResponseSchema)))
            .pipe(errorHandler(SecretCreateError));
    }).pipe(Effect.flatten);

/**
 * Delete a secret
 *
 * @param id - ID of the secret
 */
export const secretDelete = (
    options: secretDeleteOptions
): Effect.Effect<IMobyConnectionAgent, SecretDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new SecretDeleteError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/secrets/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(SecretDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a secret
 *
 * @param id - ID of the secret
 */
export const secretInspect = (
    options: secretInspectOptions
): Effect.Effect<IMobyConnectionAgent, SecretInspectError, Readonly<Secret>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new SecretInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/secrets/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SecretSchema)))
            .pipe(errorHandler(SecretInspectError));
    }).pipe(Effect.flatten);

/**
 * List secrets
 *
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the secrets list. Available filters:
 *
 *   - `id=<secret id>`
 *   - `label=<key> or label=<key>=value`
 *   - `name=<secret name>`
 *   - `names=<secret name>`
 */
export const secretList = (
    options: secretListOptions
): Effect.Effect<IMobyConnectionAgent, SecretListError, Readonly<Array<Secret>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(SecretSchema))))
            .pipe(errorHandler(SecretListError));
    }).pipe(Effect.flatten);

/**
 * Update a Secret
 *
 * @param id - The ID or name of the secret
 * @param version - The version number of the secret object being updated. This
 *   is required to avoid conflicting writes.
 * @param body - The spec of the secret to update. Currently, only the Labels
 *   field can be updated. All other fields must remain unchanged from the
 *   [SecretInspect endpoint](#operation/SecretInspect) response values.
 */
export const secretUpdate = (
    options: secretUpdateOptions
): Effect.Effect<IMobyConnectionAgent, SecretUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new SecretUpdateError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new SecretUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/secrets/{id}/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "SecretSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(SecretUpdateError));
    }).pipe(Effect.flatten);

export interface ISecretService {
    /**
     * Create a secret
     *
     * @param body -
     */
    secretCreate: WithConnectionAgentProvided<typeof secretCreate>;

    /**
     * Delete a secret
     *
     * @param id - ID of the secret
     */
    secretDelete: WithConnectionAgentProvided<typeof secretDelete>;

    /**
     * Inspect a secret
     *
     * @param id - ID of the secret
     */
    secretInspect: WithConnectionAgentProvided<typeof secretInspect>;

    /**
     * List secrets
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the secrets list. Available
     *   filters:
     *
     *   - `id=<secret id>`
     *   - `label=<key> or label=<key>=value`
     *   - `name=<secret name>`
     *   - `names=<secret name>`
     */
    secretList: WithConnectionAgentProvided<typeof secretList>;

    /**
     * Update a Secret
     *
     * @param id - The ID or name of the secret
     * @param version - The version number of the secret object being updated.
     *   This is required to avoid conflicting writes.
     * @param body - The spec of the secret to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [SecretInspect endpoint](#operation/SecretInspect) response
     *   values.
     */
    secretUpdate: WithConnectionAgentProvided<typeof secretUpdate>;
}
