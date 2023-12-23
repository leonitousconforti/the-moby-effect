import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Context, Data, Effect, Layer, Scope, Stream, pipe } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import { Plugin, PluginPrivilege } from "./schemas.js";

export class PluginsError extends Data.TaggedError("PluginsError")<{
    method: string;
    message: string;
}> {}

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

export interface GetPluginPrivilegesOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly remote: string;
}

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

export interface PluginInspectOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
}

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

export interface PluginEnableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Set the HTTP client timeout (in seconds) */
    readonly timeout?: number;
}

export interface PluginDisableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Force disable a plugin even if still in use. */
    readonly force?: boolean;
}

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

export interface PluginCreateOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Path to tar containing plugin rootfs and manifest */
    readonly tarContext: Stream.Stream<never, never, Uint8Array>;
}

export interface PluginPushOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
}

export interface PluginSetOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    readonly body?: Array<string>;
}

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
    readonly list: (
        options?: PluginListOptions | undefined
    ) => Effect.Effect<never, PluginsError, Readonly<Array<Plugin>>>;

    /**
     * Get plugin privileges
     *
     * @param remote - The name of the plugin. The `:latest` tag is optional,
     *   and is the default if omitted.
     */
    readonly getPrivileges: (
        options: GetPluginPrivilegesOptions
    ) => Effect.Effect<never, PluginsError, Readonly<Array<PluginPrivilege>>>;

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
    readonly pull: (options: PluginPullOptions) => Effect.Effect<never, PluginsError, void>;

    /**
     * Inspect a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    readonly inspect: (options: PluginInspectOptions) => Effect.Effect<never, PluginsError, Readonly<Plugin>>;

    /**
     * Remove a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Disable the plugin before removing. This may result in
     *   issues if the plugin is in use by a container.
     */
    readonly delete: (options: PluginDeleteOptions) => Effect.Effect<never, PluginsError, Readonly<Plugin>>;

    /**
     * Enable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param timeout - Set the HTTP client timeout (in seconds)
     */
    readonly enable: (options: PluginEnableOptions) => Effect.Effect<never, PluginsError, void>;

    /**
     * Disable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Force disable a plugin even if still in use.
     */
    readonly disable: (options: PluginDisableOptions) => Effect.Effect<never, PluginsError, void>;

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
    readonly upgrade: (options: PluginUpgradeOptions) => Effect.Effect<never, PluginsError, void>;

    /**
     * Create a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param tarContext - Path to tar containing plugin rootfs and manifest
     */
    readonly create: (options: PluginCreateOptions) => Effect.Effect<never, PluginsError, void>;

    /**
     * Push a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    readonly push: (options: PluginPushOptions) => Effect.Effect<never, PluginsError, void>;

    /**
     * Configure a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param body -
     */
    readonly set: (options: PluginSetOptions) => Effect.Effect<never, PluginsError, void>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Plugins> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/plugins`)),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        const PluginClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Plugin)));
        const PluginsClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Plugin)))
        );
        const PluginPrivilegesClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(PluginPrivilege)))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new PluginsError({ method, message }));

        const list_ = (
            options?: PluginListOptions | undefined
        ): Effect.Effect<never, PluginsError, Readonly<Array<Plugin>>> =>
            pipe(
                NodeHttp.request.get(""),
                addQueryParameter("filters", options?.filters),
                PluginsClient,
                Effect.catchAll(responseHandler("list"))
            );

        const getPrivileges_ = (
            options: GetPluginPrivilegesOptions
        ): Effect.Effect<never, PluginsError, Readonly<Array<PluginPrivilege>>> =>
            pipe(
                NodeHttp.request.get("/privileges"),
                addQueryParameter("remote", options.remote),
                PluginPrivilegesClient,
                Effect.catchAll(responseHandler("getPrivileges"))
            );

        const pull_ = (options: PluginPullOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/pull"),
                NodeHttp.request.setHeader("X-Registry-Auth", ""),
                addQueryParameter("remote", options.remote),
                addQueryParameter("name", options.name),
                NodeHttp.request.schemaBody(Schema.array(PluginPrivilege))(options.body ?? []),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("pull"))
            );

        const inspect_ = (options: PluginInspectOptions): Effect.Effect<never, PluginsError, Readonly<Plugin>> =>
            pipe(
                NodeHttp.request.get("/{name}/json".replace("{name}", encodeURIComponent(options.name))),
                PluginClient,
                Effect.catchAll(responseHandler("inspect"))
            );

        const delete_ = (options: PluginDeleteOptions): Effect.Effect<never, PluginsError, Readonly<Plugin>> =>
            pipe(
                NodeHttp.request.del("/{name}".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                PluginClient,
                Effect.catchAll(responseHandler("delete"))
            );

        const enable_ = (options: PluginEnableOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/{name}/enable".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("timeout", options.timeout),
                voidClient,
                Effect.catchAll(responseHandler("enable"))
            );

        const disable_ = (options: PluginDisableOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/{name}/disable".replace("{name}", encodeURIComponent(options.name))),
                addQueryParameter("force", options.force),
                voidClient,
                Effect.catchAll(responseHandler("disable"))
            );

        const upgrade_ = (options: PluginUpgradeOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/{name}/upgrade".replace("{name}", encodeURIComponent(options.name))),
                NodeHttp.request.setHeader("X-Registry-Auth", ""),
                addQueryParameter("remote", options.remote),
                NodeHttp.request.schemaBody(Schema.array(PluginPrivilege))(options.body ?? []),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("upgrade"))
            );

        const create_ = (options: PluginCreateOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/create"),
                addQueryParameter("name", options.name),
                NodeHttp.request.streamBody(options.tarContext),
                voidClient,
                Effect.catchAll(responseHandler("create"))
            );

        const push_ = (options: PluginPushOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/{name}/push".replace("{name}", encodeURIComponent(options.name))),
                voidClient,
                Effect.catchAll(responseHandler("push"))
            );

        const set_ = (options: PluginSetOptions): Effect.Effect<never, PluginsError, void> =>
            pipe(
                NodeHttp.request.post("/{name}/set".replace("{name}", encodeURIComponent(options.name))),
                NodeHttp.request.schemaBody(Schema.array(Schema.string))(options.body ?? []),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("set"))
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

export const Plugins = Context.Tag<Plugins>("the-moby-effect/Plugins");
export const layer = Layer.effect(Plugins, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
