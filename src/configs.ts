import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    WithConnectionAgentProvided,
    addHeader,
    addQueryParameter,
    errorHandler,
    setBody,
} from "./request-helpers.js";

import { Config, ConfigSchema, ConfigSpec, ConfigsCreateBody, IdResponse, IdResponseSchema } from "./schemas.js";

export class configCreateError extends Data.TaggedError("configCreateError")<{ message: string }> {}
export class configDeleteError extends Data.TaggedError("configDeleteError")<{ message: string }> {}
export class configInspectError extends Data.TaggedError("configInspectError")<{ message: string }> {}
export class configListError extends Data.TaggedError("configListError")<{ message: string }> {}
export class configUpdateError extends Data.TaggedError("configUpdateError")<{ message: string }> {}

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
): Effect.Effect<IMobyConnectionAgent, configCreateError, Readonly<IdResponse>> =>
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ConfigsCreateBody"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(IdResponseSchema)))
            .pipe(errorHandler(configCreateError));
    }).pipe(Effect.flatten);

/**
 * Delete a config
 *
 * @param id - ID of the config
 */
export const configDelete = (
    options: configDeleteOptions
): Effect.Effect<IMobyConnectionAgent, configDeleteError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new configDeleteError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/configs/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(configDeleteError));
    }).pipe(Effect.flatten);

/**
 * Inspect a config
 *
 * @param id - ID of the config
 */
export const configInspect = (
    options: configInspectOptions
): Effect.Effect<IMobyConnectionAgent, configInspectError, Readonly<Config>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new configInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/configs/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(ConfigSchema)))
            .pipe(errorHandler(configInspectError));
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
): Effect.Effect<IMobyConnectionAgent, configListError, Readonly<Array<Config>>> =>
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
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(ConfigSchema))))
            .pipe(errorHandler(configListError));
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
): Effect.Effect<IMobyConnectionAgent, configUpdateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new configUpdateError({ message: "Required parameter id was null or undefined" }));
        }

        if (options.version === null || options.version === undefined) {
            yield* _(new configUpdateError({ message: "Required parameter version was null or undefined" }));
        }

        const endpoint: string = "/configs/{id}/update";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("version", options.version))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "ConfigSpec"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(configUpdateError));
    }).pipe(Effect.flatten);

/**
 * Create a config
 *
 * @param body -
 */
export type configCreateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof configCreate>;

/**
 * Delete a config
 *
 * @param id - ID of the config
 */
export type configDeleteWithConnectionAgentProvided = WithConnectionAgentProvided<typeof configDelete>;

/**
 * Inspect a config
 *
 * @param id - ID of the config
 */
export type configInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof configInspect>;

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
export type configListWithConnectionAgentProvided = WithConnectionAgentProvided<typeof configList>;

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
export type configUpdateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof configUpdate>;
