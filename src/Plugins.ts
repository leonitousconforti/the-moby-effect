/**
 * Plugins service
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
import * as Stream from "effect/Stream";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { addQueryParameter, responseErrorHandler } from "./Requests.js";
import { Plugin, PluginPrivilege } from "./Schemas.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export class PluginsError extends Data.TaggedError("PluginsError")<{
    method: string;
    message: string;
}> {}

/** @since 1.0.0 */
export interface PluginListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the plugin list.
     *
     * Available filters:
     *
     * - `capability=<capability name>`
     * - `enable=<true>|<false>`
     */
    readonly filters?: { compatibility?: [string]; enable?: ["true" | "false"] };
}

/** @since 1.0.0 */
export interface GetPluginPrivilegesOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly remote: string;
}

/** @since 1.0.0 */
export interface PluginPullOptions {
    /**
     * Remote reference for plugin to install.
     *
     * The `:latest` tag is optional, and is used as the default if omitted.
     */
    readonly remote: string;
    /**
     * Local name for the pulled plugin.
     *
     * The `:latest` tag is optional, and is used as the default if omitted.
     */
    readonly name?: string;
    /**
     * A base64url-encoded auth configuration to use when pulling a plugin from
     * a registry.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth"?: string;
    readonly body?: Array<PluginPrivilege>;
}

/** @since 1.0.0 */
export interface PluginInspectOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
}

/** @since 1.0.0 */
export interface PluginDeleteOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /**
     * Disable the plugin before removing. This may result in issues if the
     * plugin is in use by a container.
     */
    readonly force?: boolean;
}

/** @since 1.0.0 */
export interface PluginEnableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Set the HTTP client timeout (in seconds) */
    readonly timeout?: number;
}

/** @since 1.0.0 */
export interface PluginDisableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Force disable a plugin even if still in use. */
    readonly force?: boolean;
}

/** @since 1.0.0 */
export interface PluginUpgradeOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /**
     * Remote reference to upgrade to.
     *
     * The `:latest` tag is optional, and is used as the default if omitted.
     */
    readonly remote: string;
    /**
     * A base64url-encoded auth configuration to use when pulling a plugin from
     * a registry.
     *
     * Refer to the [authentication section](#section/Authentication) for
     * details.
     */
    readonly "X-Registry-Auth"?: string;
    readonly body?: Array<PluginPrivilege>;
}

/** @since 1.0.0 */
export interface PluginCreateOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Path to tar containing plugin rootfs and manifest */
    readonly tarContext: Stream.Stream<Uint8Array>;
}

/** @since 1.0.0 */
export interface PluginPushOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
}

/** @since 1.0.0 */
export interface PluginSetOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    readonly body?: Array<string>;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Plugins {
    /**
     * List plugins
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the plugin list.
     *
     *   Available filters:
     *
     *   - `capability=<capability name>`
     *   - `enable=<true>|<false>`
     */
    readonly list: (options?: PluginListOptions | undefined) => Effect.Effect<Readonly<Array<Plugin>>, PluginsError>;

    /**
     * Get plugin privileges
     *
     * @param remote - The name of the plugin. The `:latest` tag is optional,
     *   and is the default if omitted.
     */
    readonly getPrivileges: (
        options: GetPluginPrivilegesOptions
    ) => Effect.Effect<Readonly<Array<PluginPrivilege>>, PluginsError>;

    /**
     * Install a plugin
     *
     * @param remote - Remote reference for plugin to install.
     *
     *   The `:latest` tag is optional, and is used as the default if omitted.
     * @param name - Local name for the pulled plugin.
     *
     *   The `:latest` tag is optional, and is used as the default if omitted.
     * @param X-Registry-Auth - A base64url-encoded auth configuration to use
     *   when pulling a plugin from a registry.
     *
     *   Refer to the [authentication section](#section/Authentication) for
     *   details.
     * @param body -
     */
    readonly pull: (options: PluginPullOptions) => Effect.Effect<void, PluginsError>;

    /**
     * Inspect a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    readonly inspect: (options: PluginInspectOptions) => Effect.Effect<Readonly<Plugin>, PluginsError>;

    /**
     * Remove a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Disable the plugin before removing. This may result in
     *   issues if the plugin is in use by a container.
     */
    readonly delete: (options: PluginDeleteOptions) => Effect.Effect<Readonly<Plugin>, PluginsError>;

    /**
     * Enable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param timeout - Set the HTTP client timeout (in seconds)
     */
    readonly enable: (options: PluginEnableOptions) => Effect.Effect<void, PluginsError>;

    /**
     * Disable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Force disable a plugin even if still in use.
     */
    readonly disable: (options: PluginDisableOptions) => Effect.Effect<void, PluginsError>;

    /**
     * Upgrade a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param remote - Remote reference to upgrade to.
     *
     *   The `:latest` tag is optional, and is used as the default if omitted.
     * @param X-Registry-Auth - A base64url-encoded auth configuration to use
     *   when pulling a plugin from a registry.
     *
     *   Refer to the [authentication section](#section/Authentication) for
     *   details.
     * @param body -
     */
    readonly upgrade: (options: PluginUpgradeOptions) => Effect.Effect<void, PluginsError>;

    /**
     * Create a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param tarContext - Path to tar containing plugin rootfs and manifest
     */
    readonly create: (options: PluginCreateOptions) => Effect.Effect<void, PluginsError>;

    /**
     * Push a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    readonly push: (options: PluginPushOptions) => Effect.Effect<void, PluginsError>;

    /**
     * Configure a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param body -
     */
    readonly set: (options: PluginSetOptions) => Effect.Effect<void, PluginsError>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<Plugins, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/plugins`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const PluginClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Plugin)));
        const PluginsClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(Plugin)))
        );
        const PluginPrivilegesClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(PluginPrivilege)))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new PluginsError({ method, message }));

        const list_ = (options?: PluginListOptions | undefined): Effect.Effect<Readonly<Array<Plugin>>, PluginsError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", options?.filters),
                PluginsClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const getPrivileges_ = (
            options: GetPluginPrivilegesOptions
        ): Effect.Effect<Readonly<Array<PluginPrivilege>>, PluginsError> =>
            Function.pipe(
                HttpClient.request.get("/privileges"),
                addQueryParameter("remote", options.remote),
                PluginPrivilegesClient,
                Effect.catchAll(responseHandler("getPrivileges")),
                Effect.scoped
            );

        const pull_ = (options: PluginPullOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/pull"),
                HttpClient.request.setHeader("X-Registry-Auth", ""),
                addQueryParameter("remote", options.remote),
                addQueryParameter("name", options.name),
                HttpClient.request.schemaBody(Schema.Array(PluginPrivilege))(options.body ?? []),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("pull")),
                Effect.scoped
            );

        const inspect_ = (options: PluginInspectOptions): Effect.Effect<Readonly<Plugin>, PluginsError> =>
            Function.pipe(
                HttpClient.request.get("/{name}/json".replace("{name}", encodeURIComponent(options.name))),
                PluginClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const delete_ = (options: PluginDeleteOptions): Effect.Effect<Readonly<Plugin>, PluginsError> =>
            Function.pipe(
                HttpClient.request.del("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                PluginClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const enable_ = (options: PluginEnableOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/enable".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("timeout", options.timeout),
                voidClient,
                Effect.catchAll(responseHandler("enable")),
                Effect.scoped
            );

        const disable_ = (options: PluginDisableOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/disable".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                voidClient,
                Effect.catchAll(responseHandler("disable")),
                Effect.scoped
            );

        const upgrade_ = (options: PluginUpgradeOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/upgrade".replace("{name}", encodeURIComponent(options.name))),
                HttpClient.request.setHeader("X-Registry-Auth", ""),
                addQueryParameter("remote", options.remote),
                HttpClient.request.schemaBody(Schema.Array(PluginPrivilege))(options.body ?? []),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("upgrade")),
                Effect.scoped
            );

        const create_ = (options: PluginCreateOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                addQueryParameter("name", options.name),
                HttpClient.request.streamBody(options.tarContext),
                voidClient,
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const push_ = (options: PluginPushOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/push".replace("{name}", encodeURIComponent(options.name))),
                voidClient,
                Effect.catchAll(responseHandler("push")),
                Effect.scoped
            );

        const set_ = (options: PluginSetOptions): Effect.Effect<void, PluginsError> =>
            Function.pipe(
                HttpClient.request.post("/{name}/set".replace("{name}", encodeURIComponent(options.name))),
                HttpClient.request.schemaBody(Schema.Array(Schema.String))(options.body ?? []),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("set")),
                Effect.scoped
            );

        return {
            list: list_,
            getPrivileges: getPrivileges_,
            pull: pull_,
            inspect: inspect_,
            delete: delete_,
            enable: enable_,
            disable: disable_,
            upgrade: upgrade_,
            create: create_,
            push: push_,
            set: set_,
        };
    }
);

/**
 * Plugins service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Plugins: Context.Tag<Plugins, Plugins> = Context.GenericTag<Plugins>("@the-moby-effect/Plugins");

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Plugins, never, IMobyConnectionAgent> = Layer.effect(Plugins, make).pipe(
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
): Layer.Layer<Plugins, never, Scope.Scope> => layer.pipe(Layer.provide(Layer.effect(MobyConnectionAgent, agent)));

/**
 * Constructs a layer from agent connection options
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromConnectionOptions = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Plugins, never, Scope.Scope> => fromAgent(getAgent(connectionOptions));
