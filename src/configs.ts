import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";
import { Config, ConfigSchema, ConfigSpec, ConfigsCreateBody, IDResponse, IDResponseSchema } from "./schemas.js";

export class ConfigCreateError extends Data.TaggedError("ConfigCreateError")<{ message: string }> {}
export class ConfigDeleteError extends Data.TaggedError("ConfigDeleteError")<{ message: string }> {}
export class ConfigInspectError extends Data.TaggedError("ConfigInspectError")<{ message: string }> {}
export class ConfigListError extends Data.TaggedError("ConfigListError")<{ message: string }> {}
export class ConfigUpdateError extends Data.TaggedError("ConfigUpdateError")<{ message: string }> {}

export interface ConfigDeleteOptions {
    /** ID of the config */
    id: string;
}

export interface ConfigInspectOptions {
    /** ID of the config */
    id: string;
}

export interface ConfigListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the configs list. Available filters:
     *
     * - `id=<config id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<config name>`
     * - `names=<config name>`
     */
    filters?: string;
}

export interface ConfigUpdateOptions {
    /** The ID or name of the config */
    id: string;
    /**
     * The version number of the config object being updated. This is required
     * to avoid conflicting writes.
     */
    version: number;
    /**
     * The spec of the config to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [ConfigInspect
     * endpoint](#operation/ConfigInspect) response values.
     */
    spec?: ConfigSpec;
}

/**
 * Create a config
 *
 * @param name - User-defined name of the config
 * @param labels - User-defined key/value metadata
 * @param data - Base64-url-safe-encoded ([RFC 4648 section
 *   5](https://tools.ietf.org/html/rfc4648#section-5)) config data
 * @param templating -
 */
export const configCreate = (
    options: ConfigsCreateBody
): Effect.Effect<IMobyConnectionAgent, ConfigCreateError, Readonly<IDResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs/create";
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
            .pipe(setBody(options, "ConfigsCreateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IDResponseSchema)))
            .pipe(responseErrorHandler(ConfigCreateError));
    }).pipe(Effect.flatten);

/**
 * Delete a config
 *
 * @param id - ID of the config
 */
export const configDelete = (
    options: ConfigDeleteOptions
): Effect.Effect<IMobyConnectionAgent, ConfigDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs/{id}";
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
            .pipe(responseErrorHandler(ConfigDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a config
 *
 * @param id - ID of the config
 */
export const configInspect = (
    options: ConfigInspectOptions
): Effect.Effect<IMobyConnectionAgent, ConfigInspectError, Readonly<Config>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs/{id}";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ConfigSchema)))
            .pipe(responseErrorHandler(ConfigInspectError));
    }).pipe(Effect.flatten);

/**
 * List configs
 *
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the configs list. Available filters:
 *
 *   - `id=<config id>`
 *   - `label=<key> or label=<key>=value`
 *   - `name=<config name>`
 *   - `names=<config name>`
 */
export const configList = (
    options?: ConfigListOptions | undefined
): Effect.Effect<IMobyConnectionAgent, ConfigListError, Readonly<Array<Config>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ConfigSchema))))
            .pipe(responseErrorHandler(ConfigListError));
    }).pipe(Effect.flatten);

/**
 * Update a Config
 *
 * @param id - The ID or name of the config
 * @param version - The version number of the config object being updated. This
 *   is required to avoid conflicting writes.
 * @param spec - The spec of the config to update. Currently, only the Labels
 *   field can be updated. All other fields must remain unchanged from the
 *   [ConfigInspect endpoint](#operation/ConfigInspect) response values.
 */
export const configUpdate = (
    options: ConfigUpdateOptions
): Effect.Effect<IMobyConnectionAgent, ConfigUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs/{id}/update";
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
            .pipe(setBody(options.spec, "ConfigSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(ConfigUpdateError));
    }).pipe(Effect.flatten);

export interface IConfigService {
    Errors: ConfigCreateError | ConfigDeleteError | ConfigInspectError | ConfigListError | ConfigUpdateError;

    /**
     * Create a config
     *
     * @param name - User-defined name of the config
     * @param labels - User-defined key/value metadata
     * @param data - Base64-url-safe-encoded ([RFC 4648 section
     *   5](https://tools.ietf.org/html/rfc4648#section-5)) config data
     * @param templating -
     */
    configCreate: WithConnectionAgentProvided<typeof configCreate>;

    /**
     * Delete a config
     *
     * @param id - ID of the config
     */
    configDelete: WithConnectionAgentProvided<typeof configDelete>;

    /**
     * Inspect a config
     *
     * @param id - ID of the config
     */
    configInspect: WithConnectionAgentProvided<typeof configInspect>;

    /**
     * List configs
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the configs list. Available
     *   filters:
     *
     *   - `id=<config id>`
     *   - `label=<key> or label=<key>=value`
     *   - `name=<config name>`
     *   - `names=<config name>`
     */
    configList: WithConnectionAgentProvided<typeof configList>;

    /**
     * Update a Config
     *
     * @param id - The ID or name of the config
     * @param version - The version number of the config object being updated.
     *   This is required to avoid conflicting writes.
     * @param spec - The spec of the config to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [ConfigInspect endpoint](#operation/ConfigInspect) response
     *   values.
     */
    configUpdate: WithConnectionAgentProvided<typeof configUpdate>;
}
