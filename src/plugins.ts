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

import { Plugin, PluginPrivilege, PluginPrivilegeSchema, PluginSchema } from "./schemas.js";

export class getPluginPrivilegesError extends Data.TaggedError("getPluginPrivilegesError")<{ message: string }> {}
export class pluginCreateError extends Data.TaggedError("pluginCreateError")<{ message: string }> {}
export class pluginDeleteError extends Data.TaggedError("pluginDeleteError")<{ message: string }> {}
export class pluginDisableError extends Data.TaggedError("pluginDisableError")<{ message: string }> {}
export class pluginEnableError extends Data.TaggedError("pluginEnableError")<{ message: string }> {}
export class pluginInspectError extends Data.TaggedError("pluginInspectError")<{ message: string }> {}
export class pluginListError extends Data.TaggedError("pluginListError")<{ message: string }> {}
export class pluginPullError extends Data.TaggedError("pluginPullError")<{ message: string }> {}
export class pluginPushError extends Data.TaggedError("pluginPushError")<{ message: string }> {}
export class pluginSetError extends Data.TaggedError("pluginSetError")<{ message: string }> {}
export class pluginUpgradeError extends Data.TaggedError("pluginUpgradeError")<{ message: string }> {}

export interface getPluginPrivilegesOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    remote: string;
}

export interface pluginCreateOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /** Path to tar containing plugin rootfs and manifest */
    body?: unknown;
}

export interface pluginDeleteOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /**
     * Disable the plugin before removing. This may result in issues if the
     * plugin is in use by a container.
     */
    force?: boolean;
}

export interface pluginDisableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /** Force disable a plugin even if still in use. */
    force?: boolean;
}

export interface pluginEnableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /** Set the HTTP client timeout (in seconds) */
    timeout?: number;
}

export interface pluginInspectOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
}

export interface pluginListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the plugin list. Available filters:
     *
     * - `capability=<capability name>`
     * - `enable=<true>|<false>`
     */
    filters?: string;
}

export interface pluginPullOptions {
    /**
     * Remote reference for plugin to install. The `:latest` tag is optional,
     * and is used as the default if omitted.
     */
    remote: string;
    body?: Array<PluginPrivilege>;
    /**
     * Local name for the pulled plugin. The `:latest` tag is optional, and is
     * used as the default if omitted.
     */
    name?: string;
    /**
     * A base64url-encoded auth configuration to use when pulling a plugin from
     * a registry. Refer to the [authentication
     * section](#section/Authentication) for details.
     */
    X_Registry_Auth?: string;
}

export interface pluginPushOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
}

export interface pluginSetOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    body?: Array<string>;
}

export interface pluginUpgradeOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /**
     * Remote reference to upgrade to. The `:latest` tag is optional, and is
     * used as the default if omitted.
     */
    remote: string;
    body?: Array<PluginPrivilege>;
    /**
     * A base64url-encoded auth configuration to use when pulling a plugin from
     * a registry. Refer to the [authentication
     * section](#section/Authentication) for details.
     */
    X_Registry_Auth?: string;
}

/**
 * Get plugin privileges
 *
 * @param remote - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export const getPluginPrivileges = (
    options: getPluginPrivilegesOptions
): Effect.Effect<IMobyConnectionAgent, getPluginPrivilegesError, Readonly<Array<PluginPrivilege>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.remote === null || options.remote === undefined) {
            yield* _(new getPluginPrivilegesError({ message: "Required parameter remote was null or undefined" }));
        }

        const endpoint: string = "/plugins/privileges";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(PluginPrivilegeSchema))))
            .pipe(errorHandler(getPluginPrivilegesError));
    }).pipe(Effect.flatten);

/**
 * Create a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param body - Path to tar containing plugin rootfs and manifest
 */
export const pluginCreate = (
    options: pluginCreateOptions
): Effect.Effect<IMobyConnectionAgent, pluginCreateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginCreateError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("name", options.name))
            .pipe(addHeader("Content-Type", "application/x-tar"))
            .pipe(setBody(options.body, "unknown"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(pluginCreateError));
    }).pipe(Effect.flatten);

/**
 * Remove a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param force - Disable the plugin before removing. This may result in issues
 *   if the plugin is in use by a container.
 */
export const pluginDelete = (
    options: pluginDeleteOptions
): Effect.Effect<IMobyConnectionAgent, pluginDeleteError, Readonly<Plugin>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginDeleteError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(PluginSchema)))
            .pipe(errorHandler(pluginDeleteError));
    }).pipe(Effect.flatten);

/**
 * Disable a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param force - Force disable a plugin even if still in use.
 */
export const pluginDisable = (
    options: pluginDisableOptions
): Effect.Effect<IMobyConnectionAgent, pluginDisableError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginDisableError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}/disable";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(pluginDisableError));
    }).pipe(Effect.flatten);

/**
 * Enable a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param timeout - Set the HTTP client timeout (in seconds)
 */
export const pluginEnable = (
    options: pluginEnableOptions
): Effect.Effect<IMobyConnectionAgent, pluginEnableError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginEnableError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}/enable";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addQueryParameter("timeout", options.timeout))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(pluginEnableError));
    }).pipe(Effect.flatten);

/**
 * Inspect a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export const pluginInspect = (
    options: pluginInspectOptions
): Effect.Effect<IMobyConnectionAgent, pluginInspectError, Readonly<Plugin>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginInspectError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(PluginSchema)))
            .pipe(errorHandler(pluginInspectError));
    }).pipe(Effect.flatten);

/**
 * Returns information about installed plugins.
 *
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the plugin list. Available filters:
 *
 *   - `capability=<capability name>`
 *   - `enable=<true>|<false>`
 */
export const pluginList = (
    options: pluginListOptions
): Effect.Effect<IMobyConnectionAgent, pluginListError, Readonly<Array<Plugin>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins";
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
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(PluginSchema))))
            .pipe(errorHandler(pluginListError));
    }).pipe(Effect.flatten);

/**
 * Pulls and installs a plugin. After the plugin is installed, it can be enabled
 * using the [`POST /plugins/{name}/enable`
 * endpoint](#operation/PostPluginsEnable).
 *
 * @param remote - Remote reference for plugin to install. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param body -
 * @param name - Local name for the pulled plugin. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param X_Registry_Auth - A base64url-encoded auth configuration to use when
 *   pulling a plugin from a registry. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export const pluginPull = (options: pluginPullOptions): Effect.Effect<IMobyConnectionAgent, pluginPullError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.remote === null || options.remote === undefined) {
            yield* _(new pluginPullError({ message: "Required parameter remote was null or undefined" }));
        }

        const endpoint: string = "/plugins/pull";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(addQueryParameter("name", options.name))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "Array&lt;PluginPrivilege&gt;"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(pluginPullError));
    }).pipe(Effect.flatten);

/**
 * Push a plugin to the registry.
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export const pluginPush = (options: pluginPushOptions): Effect.Effect<IMobyConnectionAgent, pluginPushError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginPushError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}/push";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(errorHandler(pluginPushError));
    }).pipe(Effect.flatten);

/**
 * Configure a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param body -
 */
export const pluginSet = (options: pluginSetOptions): Effect.Effect<IMobyConnectionAgent, pluginSetError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginSetError({ message: "Required parameter name was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}/set";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "Array&lt;string&gt;"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(pluginSetError));
    }).pipe(Effect.flatten);

/**
 * Upgrade a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param remote - Remote reference to upgrade to. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param body -
 * @param X_Registry_Auth - A base64url-encoded auth configuration to use when
 *   pulling a plugin from a registry. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export const pluginUpgrade = (
    options: pluginUpgradeOptions
): Effect.Effect<IMobyConnectionAgent, pluginUpgradeError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.name === null || options.name === undefined) {
            yield* _(new pluginUpgradeError({ message: "Required parameter name was null or undefined" }));
        }

        if (options.remote === null || options.remote === undefined) {
            yield* _(new pluginUpgradeError({ message: "Required parameter remote was null or undefined" }));
        }

        const endpoint: string = "/plugins/{name}/upgrade";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl("http://0.0.0.0"))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "Array&lt;PluginPrivilege&gt;"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(errorHandler(pluginUpgradeError));
    }).pipe(Effect.flatten);

/**
 * Get plugin privileges
 *
 * @param remote - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export type getPluginPrivilegesWithConnectionAgentProvided = WithConnectionAgentProvided<typeof getPluginPrivileges>;

/**
 * Create a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param body - Path to tar containing plugin rootfs and manifest
 */
export type pluginCreateWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginCreate>;

/**
 * Remove a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param force - Disable the plugin before removing. This may result in issues
 *   if the plugin is in use by a container.
 */
export type pluginDeleteWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginDelete>;

/**
 * Disable a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param force - Force disable a plugin even if still in use.
 */
export type pluginDisableWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginDisable>;

/**
 * Enable a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param timeout - Set the HTTP client timeout (in seconds)
 */
export type pluginEnableWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginEnable>;

/**
 * Inspect a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export type pluginInspectWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginInspect>;

/**
 * Returns information about installed plugins.
 *
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the plugin list. Available filters:
 *
 *   - `capability=<capability name>`
 *   - `enable=<true>|<false>`
 */
export type pluginListWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginList>;

/**
 * Pulls and installs a plugin. After the plugin is installed, it can be enabled
 * using the [`POST /plugins/{name}/enable`
 * endpoint](#operation/PostPluginsEnable).
 *
 * @param remote - Remote reference for plugin to install. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param body -
 * @param name - Local name for the pulled plugin. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param X_Registry_Auth - A base64url-encoded auth configuration to use when
 *   pulling a plugin from a registry. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export type pluginPullWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginPull>;

/**
 * Push a plugin to the registry.
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export type pluginPushWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginPush>;

/**
 * Configure a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param body -
 */
export type pluginSetWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginSet>;

/**
 * Upgrade a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param remote - Remote reference to upgrade to. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param body -
 * @param X_Registry_Auth - A base64url-encoded auth configuration to use when
 *   pulling a plugin from a registry. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export type pluginUpgradeWithConnectionAgentProvided = WithConnectionAgentProvided<typeof pluginUpgrade>;
