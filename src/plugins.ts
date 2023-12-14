import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler, setBody } from "./request-helpers.js";
import { Plugin, PluginPrivilege, PluginPrivilegeSchema, PluginSchema } from "./schemas.js";

export class GetPluginPrivilegesError extends Data.TaggedError("GetPluginPrivilegesError")<{ message: string }> {}
export class PluginCreateError extends Data.TaggedError("PluginCreateError")<{ message: string }> {}
export class PluginDeleteError extends Data.TaggedError("PluginDeleteError")<{ message: string }> {}
export class PluginDisableError extends Data.TaggedError("PluginDisableError")<{ message: string }> {}
export class PluginEnableError extends Data.TaggedError("PluginEnableError")<{ message: string }> {}
export class PluginInspectError extends Data.TaggedError("PluginInspectError")<{ message: string }> {}
export class PluginListError extends Data.TaggedError("PluginListError")<{ message: string }> {}
export class PluginPullError extends Data.TaggedError("PluginPullError")<{ message: string }> {}
export class PluginPushError extends Data.TaggedError("PluginPushError")<{ message: string }> {}
export class PluginSetError extends Data.TaggedError("PluginSetError")<{ message: string }> {}
export class PluginUpgradeError extends Data.TaggedError("PluginUpgradeError")<{ message: string }> {}

export interface GetPluginPrivilegesOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    remote: string;
}

export interface PluginCreateOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /** Path to tar containing plugin rootfs and manifest */
    body?: unknown;
}

export interface PluginDeleteOptions {
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

export interface PluginDisableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /** Force disable a plugin even if still in use. */
    force?: boolean;
}

export interface PluginEnableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    /** Set the HTTP client timeout (in seconds) */
    timeout?: number;
}

export interface PluginInspectOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
}

export interface PluginListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the plugin list. Available filters:
     *
     * - `capability=<capability name>`
     * - `enable=<true>|<false>`
     */
    filters?: string;
}

export interface PluginPullOptions {
    /**
     * Remote reference for plugin to install. The `:latest` tag is optional,
     * and is used as the default if omitted.
     */
    remote: string;
    privileges?: Array<PluginPrivilege>;
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

export interface PluginPushOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
}

export interface PluginSetOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    name: string;
    body?: Array<string>;
}

export interface PluginUpgradeOptions {
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
    options: GetPluginPrivilegesOptions
): Effect.Effect<IMobyConnectionAgent, GetPluginPrivilegesError, Readonly<Array<PluginPrivilege>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/privileges";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(PluginPrivilegeSchema))))
            .pipe(responseErrorHandler(GetPluginPrivilegesError));
    }).pipe(Effect.flatten);

/**
 * Create a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param body - Path to tar containing plugin rootfs and manifest
 */
export const pluginCreate = (
    options: PluginCreateOptions
): Effect.Effect<IMobyConnectionAgent, PluginCreateError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/create";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("name", options.name))
            .pipe(addHeader("Content-Type", "application/x-tar"))
            .pipe(setBody(options.body, "unknown"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(PluginCreateError));
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
    options: PluginDeleteOptions
): Effect.Effect<IMobyConnectionAgent, PluginDeleteError, Readonly<Plugin>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "DELETE";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(PluginSchema)))
            .pipe(responseErrorHandler(PluginDeleteError));
    }).pipe(Effect.flatten);

/**
 * Disable a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param force - Force disable a plugin even if still in use.
 */
export const pluginDisable = (
    options: PluginDisableOptions
): Effect.Effect<IMobyConnectionAgent, PluginDisableError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}/disable";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("force", options.force))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(PluginDisableError));
    }).pipe(Effect.flatten);

/**
 * Enable a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param timeout - Set the HTTP client timeout (in seconds)
 */
export const pluginEnable = (
    options: PluginEnableOptions
): Effect.Effect<IMobyConnectionAgent, PluginEnableError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}/enable";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("timeout", options.timeout))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(PluginEnableError));
    }).pipe(Effect.flatten);

/**
 * Inspect a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export const pluginInspect = (
    options: PluginInspectOptions
): Effect.Effect<IMobyConnectionAgent, PluginInspectError, Readonly<Plugin>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}/json";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(PluginSchema)))
            .pipe(responseErrorHandler(PluginInspectError));
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
    options?: PluginListOptions | undefined
): Effect.Effect<IMobyConnectionAgent, PluginListError, Readonly<Array<Plugin>>> =>
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
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addQueryParameter("filters", options?.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(PluginSchema))))
            .pipe(responseErrorHandler(PluginListError));
    }).pipe(Effect.flatten);

/**
 * Pulls and installs a plugin. After the plugin is installed, it can be enabled
 * using the [`POST /plugins/{name}/enable`
 * endpoint](#operation/PostPluginsEnable).
 *
 * @param remote - Remote reference for plugin to install. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param privileges -
 * @param name - Local name for the pulled plugin. The `:latest` tag is
 *   optional, and is used as the default if omitted.
 * @param X_Registry_Auth - A base64url-encoded auth configuration to use when
 *   pulling a plugin from a registry. Refer to the [authentication
 *   section](#section/Authentication) for details.
 */
export const pluginPull = (options: PluginPullOptions): Effect.Effect<IMobyConnectionAgent, PluginPullError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/pull";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(addQueryParameter("name", options.name))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.privileges, "Array&lt;PluginPrivilege&gt;"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(PluginPullError));
    }).pipe(Effect.flatten);

/**
 * Push a plugin to the registry.
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 */
export const pluginPush = (options: PluginPushOptions): Effect.Effect<IMobyConnectionAgent, PluginPushError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}/push";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(responseErrorHandler(PluginPushError));
    }).pipe(Effect.flatten);

/**
 * Configure a plugin
 *
 * @param name - The name of the plugin. The `:latest` tag is optional, and is
 *   the default if omitted.
 * @param body -
 */
export const pluginSet = (options: PluginSetOptions): Effect.Effect<IMobyConnectionAgent, PluginSetError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}/set";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "Array&lt;string&gt;"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(PluginSetError));
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
    options: PluginUpgradeOptions
): Effect.Effect<IMobyConnectionAgent, PluginUpgradeError, void> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/plugins/{name}/upgrade";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "POST";
        const sanitizedEndpoint: string = endpoint.replace(`{${"name"}}`, encodeURIComponent(String(options.name)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(agent.nodeRequestUrl))
            .pipe(addHeader("X-Registry-Auth", String(options.X_Registry_Auth)))
            .pipe(addQueryParameter("remote", options.remote))
            .pipe(addHeader("Content-Type", "application/json"))
            .pipe(setBody(options.body, "Array&lt;PluginPrivilege&gt;"))
            .pipe(Effect.flatMap(client.pipe(NodeHttp.client.filterStatusOk)))
            .pipe(responseErrorHandler(PluginUpgradeError));
    }).pipe(Effect.flatten);

export interface IPluginService {
    Errors:
        | GetPluginPrivilegesError
        | PluginCreateError
        | PluginDeleteError
        | PluginDisableError
        | PluginEnableError
        | PluginInspectError
        | PluginListError
        | PluginPullError
        | PluginPushError
        | PluginSetError
        | PluginUpgradeError;

    /**
     * Get plugin privileges
     *
     * @param remote - The name of the plugin. The `:latest` tag is optional,
     *   and is the default if omitted.
     */
    getPluginPrivileges: WithConnectionAgentProvided<typeof getPluginPrivileges>;

    /**
     * Create a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param body - Path to tar containing plugin rootfs and manifest
     */
    pluginCreate: WithConnectionAgentProvided<typeof pluginCreate>;

    /**
     * Remove a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Disable the plugin before removing. This may result in
     *   issues if the plugin is in use by a container.
     */
    pluginDelete: WithConnectionAgentProvided<typeof pluginDelete>;

    /**
     * Disable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Force disable a plugin even if still in use.
     */
    pluginDisable: WithConnectionAgentProvided<typeof pluginDisable>;

    /**
     * Enable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param timeout - Set the HTTP client timeout (in seconds)
     */
    pluginEnable: WithConnectionAgentProvided<typeof pluginEnable>;

    /**
     * Inspect a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    pluginInspect: WithConnectionAgentProvided<typeof pluginInspect>;

    /**
     * Returns information about installed plugins.
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the plugin list. Available
     *   filters:
     *
     *   - `capability=<capability name>`
     *   - `enable=<true>|<false>`
     */
    pluginList: WithConnectionAgentProvided<typeof pluginList>;

    /**
     * Pulls and installs a plugin. After the plugin is installed, it can be
     * enabled using the [`POST /plugins/{name}/enable`
     * endpoint](#operation/PostPluginsEnable).
     *
     * @param remote - Remote reference for plugin to install. The `:latest` tag
     *   is optional, and is used as the default if omitted.
     * @param privileges -
     * @param name - Local name for the pulled plugin. The `:latest` tag is
     *   optional, and is used as the default if omitted.
     * @param X_Registry_Auth - A base64url-encoded auth configuration to use
     *   when pulling a plugin from a registry. Refer to the [authentication
     *   section](#section/Authentication) for details.
     */
    pluginPull: WithConnectionAgentProvided<typeof pluginPull>;

    /**
     * Push a plugin to the registry.
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    pluginPush: WithConnectionAgentProvided<typeof pluginPush>;

    /**
     * Configure a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param body -
     */
    pluginSet: WithConnectionAgentProvided<typeof pluginSet>;

    /**
     * Upgrade a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param remote - Remote reference to upgrade to. The `:latest` tag is
     *   optional, and is used as the default if omitted.
     * @param body -
     * @param X_Registry_Auth - A base64url-encoded auth configuration to use
     *   when pulling a plugin from a registry. Refer to the [authentication
     *   section](#section/Authentication) for details.
     */
    pluginUpgrade: WithConnectionAgentProvided<typeof pluginUpgrade>;
}
