import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, errorHandler, setBody } from "./request-helpers.js";
import { Config, ConfigSchema, ConfigSpec, ConfigsCreateBody, IdResponse, IdResponseSchema } from "./schemas.js";

export class ConfigCreateError extends Data.TaggedError("ConfigCreateError")<{ message: string }> {}
export class ConfigDeleteError extends Data.TaggedError("ConfigDeleteError")<{ message: string }> {}
export class ConfigInspectError extends Data.TaggedError("ConfigInspectError")<{ message: string }> {}
export class ConfigListError extends Data.TaggedError("ConfigListError")<{ message: string }> {}
export class ConfigUpdateError extends Data.TaggedError("ConfigUpdateError")<{ message: string }> {}

export interface configCreateOptions {
    body?: ConfigsCreateBody;
}

export interface configDeleteOptions {
    /** ID of the config */
    id: string;
}

export interface configInspectOptions {
    /** ID of the config */
    id: string;
}

export interface configListOptions {
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

export interface configUpdateOptions {
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
    body?: ConfigSpec;
}

/**
 * Create a config
 *
 * @param body -
 */
export const configCreate = (
    options: configCreateOptions
): Effect.Effect<IMobyConnectionAgent, ConfigCreateError, Readonly<IdResponse>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs/create";
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
            .pipe(setBody(options.body, "ConfigsCreateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IdResponseSchema)))
            .pipe(errorHandler(ConfigCreateError));
    }).pipe(Effect.flatten);

/**
 * Delete a config
 *
 * @param id - ID of the config
 */
export const configDelete = (
    options: configDeleteOptions
): Effect.Effect<IMobyConnectionAgent, ConfigDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new ConfigDeleteError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/configs/{id}";
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
            .pipe(errorHandler(ConfigDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a config
 *
 * @param id - ID of the config
 */
export const configInspect = (
    options: configInspectOptions
): Effect.Effect<IMobyConnectionAgent, ConfigInspectError, Readonly<Config>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new ConfigInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/configs/{id}";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ConfigSchema)))
            .pipe(errorHandler(ConfigInspectError));
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
    options: configListOptions
): Effect.Effect<IMobyConnectionAgent, ConfigListError, Readonly<Array<Config>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/configs";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ConfigSchema))))
            .pipe(errorHandler(ConfigListError));
    }).pipe(Effect.flatten);

/**
 * Update a Config
 *
 * @param id - The ID or name of the config
 * @param version - The version number of the config object being updated. This
 *   is required to avoid conflicting writes.
 * @param body - The spec of the config to update. Currently, only the Labels
 *   field can be updated. All other fields must remain unchanged from the
 *   [ConfigInspect endpoint](#operation/ConfigInspect) response values.
 */
export const configUpdate = (
    options: configUpdateOptions
): Effect.Effect<IMobyConnectionAgent, ConfigUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new ConfigUpdateError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new ConfigUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/configs/{id}/update";
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
            .pipe(setBody(options.body, "ConfigSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(ConfigUpdateError));
    }).pipe(Effect.flatten);

export interface IConfigService {
    /**
     * Create a config
     *
     * @param body -
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
     * @param body - The spec of the config to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [ConfigInspect endpoint](#operation/ConfigInspect) response
     *   values.
     */
    configUpdate: WithConnectionAgentProvided<typeof configUpdate>;
}
