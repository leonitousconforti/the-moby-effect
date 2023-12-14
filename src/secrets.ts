import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";
import { IDResponse, IDResponseSchema, Secret, SecretSchema, SecretSpec, SecretsCreateBody } from "./schemas.js";

export class SecretCreateError extends Data.TaggedError("SecretCreateError")<{ message: string }> {}
export class SecretDeleteError extends Data.TaggedError("SecretDeleteError")<{ message: string }> {}
export class SecretInspectError extends Data.TaggedError("SecretInspectError")<{ message: string }> {}
export class SecretListError extends Data.TaggedError("SecretListError")<{ message: string }> {}
export class SecretUpdateError extends Data.TaggedError("SecretUpdateError")<{ message: string }> {}

export interface SecretDeleteOptions {
    /** ID of the secret */
    id: string;
}

export interface SecretInspectOptions {
    /** ID of the secret */
    id: string;
}

export interface SecretListOptions {
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

export interface SecretUpdateOptions {
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
    spec?: SecretSpec;
}

/**
 * Create a secret
 *
 * @param Name - User-defined name of the secret.
 * @param Labels - User-defined key/value metadata.
 * @param Data - Base64-url-safe-encoded ([RFC 4648 sec.
 *   5](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
 *   secret.
 * @param Driver -
 * @param Templating
 */
export const secretCreate = (
    options: SecretsCreateBody
): Effect.Effect<IMobyConnectionAgent, SecretCreateError, Readonly<IDResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options, "SecretsCreateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IDResponseSchema)))
            .pipe(responseErrorHandler(SecretCreateError));
    }).pipe(Effect.flatten);

/**
 * Delete a secret
 *
 * @param id - ID of the secret
 */
export const secretDelete = (
    options: SecretDeleteOptions
): Effect.Effect<IMobyConnectionAgent, SecretDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(SecretDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a secret
 *
 * @param id - ID of the secret
 */
export const secretInspect = (
    options: SecretInspectOptions
): Effect.Effect<IMobyConnectionAgent, SecretInspectError, Readonly<Secret>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(SecretSchema)))
            .pipe(responseErrorHandler(SecretInspectError));
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
    options?: SecretListOptions | undefined
): Effect.Effect<IMobyConnectionAgent, SecretListError, Readonly<Array<Secret>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("filters", options?.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(SecretSchema))))
            .pipe(responseErrorHandler(SecretListError));
    }).pipe(Effect.flatten);

/**
 * Update a Secret
 *
 * @param id - The ID or name of the secret
 * @param version - The version number of the secret object being updated. This
 *   is required to avoid conflicting writes.
 * @param spec - The spec of the secret to update. Currently, only the Labels
 *   field can be updated. All other fields must remain unchanged from the
 *   [SecretInspect endpoint](#operation/SecretInspect) response values.
 */
export const secretUpdate = (
    options: SecretUpdateOptions
): Effect.Effect<IMobyConnectionAgent, SecretUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/secrets/{id}/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.spec, "SecretSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(SecretUpdateError));
    }).pipe(Effect.flatten);

export interface ISecretService {
    Errors: SecretCreateError | SecretDeleteError | SecretInspectError | SecretListError | SecretUpdateError;

    /**
     * Create a secret
     *
     * @param Name - User-defined name of the secret.
     * @param Labels - User-defined key/value metadata.
     * @param Data - Base64-url-safe-encoded ([RFC 4648 sec.
     *   5](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
     *   secret.
     * @param Driver -
     * @param Templating
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
     * @param spec - The spec of the secret to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [SecretInspect endpoint](#operation/SecretInspect) response
     *   values.
     */
    secretUpdate: WithConnectionAgentProvided<typeof secretUpdate>;
}
