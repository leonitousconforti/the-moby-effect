/**
 * Plugins service
 *
 * @since 1.0.0
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Plugin
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";

import { Plugin, PluginPrivilege } from "../Schemas.js";
import { maybeAddHeader, maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const PluginsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/PluginsError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type PluginsErrorTypeId = typeof PluginsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isPluginsError = (u: unknown): u is PluginsError => Predicate.hasProperty(u, PluginsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class PluginsError extends PlatformError.RefailError(PluginsErrorTypeId, "PluginsError")<{
    method: string;
    error: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return `${this.method}: ${super.message}`;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface GetPluginPrivilegesOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly remote: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface PluginInspectOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface PluginEnableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Set the HTTP client timeout (in seconds) */
    readonly timeout?: number;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PluginDisableOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Force disable a plugin even if still in use. */
    readonly force?: boolean;
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Params
 */
export interface PluginCreateOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
    /** Path to tar containing plugin rootfs and manifest */
    readonly tarContext: Stream.Stream<Uint8Array, PluginsError, never>;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PluginPushOptions {
    /**
     * The name of the plugin. The `:latest` tag is optional, and is the default
     * if omitted.
     */
    readonly name: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
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
export interface PluginsImpl {
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
    ) => Effect.Effect<Readonly<Array<Plugin>>, PluginsError, never>;

    /**
     * Get plugin privileges
     *
     * @param remote - The name of the plugin. The `:latest` tag is optional,
     *   and is the default if omitted.
     */
    readonly getPrivileges: (
        options: GetPluginPrivilegesOptions
    ) => Effect.Effect<Readonly<Array<PluginPrivilege>>, PluginsError, never>;

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
    readonly pull: (options: PluginPullOptions) => Effect.Effect<void, PluginsError, never>;

    /**
     * Inspect a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    readonly inspect: (options: PluginInspectOptions) => Effect.Effect<Readonly<Plugin>, PluginsError, never>;

    /**
     * Remove a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Disable the plugin before removing. This may result in
     *   issues if the plugin is in use by a container.
     */
    readonly delete: (options: PluginDeleteOptions) => Effect.Effect<Readonly<Plugin>, PluginsError, never>;

    /**
     * Enable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param timeout - Set the HTTP client timeout (in seconds)
     */
    readonly enable: (options: PluginEnableOptions) => Effect.Effect<void, PluginsError, never>;

    /**
     * Disable a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param force - Force disable a plugin even if still in use.
     */
    readonly disable: (options: PluginDisableOptions) => Effect.Effect<void, PluginsError, never>;

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
    readonly upgrade: (options: PluginUpgradeOptions) => Effect.Effect<void, PluginsError, never>;

    /**
     * Create a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param tarContext - Path to tar containing plugin rootfs and manifest
     */
    readonly create: (options: PluginCreateOptions) => Effect.Effect<void, PluginsError, never>;

    /**
     * Push a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     */
    readonly push: (options: PluginPushOptions) => Effect.Effect<void, PluginsError, never>;

    /**
     * Configure a plugin
     *
     * @param name - The name of the plugin. The `:latest` tag is optional, and
     *   is the default if omitted.
     * @param body -
     */
    readonly set: (options: PluginSetOptions) => Effect.Effect<void, PluginsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<PluginsImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/plugins")),
        HttpClient.filterStatusOk
    );

    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const PluginClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Plugin)));
    const PluginsClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(Plugin))));
    const PluginPrivilegesClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(Schema.Array(PluginPrivilege)))
    );

    const list_ = (options?: PluginListOptions | undefined): Effect.Effect<Readonly<Array<Plugin>>, PluginsError> =>
        Function.pipe(
            HttpClientRequest.get(""),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            PluginsClient,
            Effect.mapError((error) => new PluginsError({ method: "list", error })),
            Effect.scoped
        );

    const getPrivileges_ = (
        options: GetPluginPrivilegesOptions
    ): Effect.Effect<Readonly<Array<PluginPrivilege>>, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/privileges"),
            maybeAddQueryParameter("remote", Option.some(options.remote)),
            PluginPrivilegesClient,
            Effect.mapError((error) => new PluginsError({ method: "getPrivileges", error })),
            Effect.scoped
        );

    const pull_ = (options: PluginPullOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/pull"),
            HttpClientRequest.setHeader("X-Registry-Auth", ""),
            maybeAddQueryParameter("remote", Option.some(options.remote)),
            maybeAddQueryParameter("name", Option.fromNullable(options.name)),
            HttpClientRequest.schemaBody(Schema.Array(PluginPrivilege))(options.body ?? []),
            Effect.flatMap(voidClient),
            Effect.mapError((error) => new PluginsError({ method: "pull", error })),
            Effect.scoped
        );

    const inspect_ = (options: PluginInspectOptions): Effect.Effect<Readonly<Plugin>, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.name)}/json`),
            PluginClient,
            Effect.mapError((error) => new PluginsError({ method: "inspect", error })),
            Effect.scoped
        );

    const delete_ = (options: PluginDeleteOptions): Effect.Effect<Readonly<Plugin>, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/${encodeURIComponent(options.name)}`),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            PluginClient,
            Effect.mapError((error) => new PluginsError({ method: "delete", error })),
            Effect.scoped
        );

    const enable_ = (options: PluginEnableOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/enable`),
            maybeAddQueryParameter("timeout", Option.fromNullable(options.timeout)),
            voidClient,
            Effect.mapError((error) => new PluginsError({ method: "enable", error })),
            Effect.scoped
        );

    const disable_ = (options: PluginDisableOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/disable`),
            maybeAddQueryParameter("force", Option.fromNullable(options.force)),
            voidClient,
            Effect.mapError((error) => new PluginsError({ method: "disable", error })),
            Effect.scoped
        );

    const upgrade_ = (options: PluginUpgradeOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/upgrade`),
            maybeAddHeader("X-Registry-Auth", Option.fromNullable(options["X-Registry-Auth"])),
            maybeAddQueryParameter("remote", Option.some(options.remote)),
            HttpClientRequest.schemaBody(Schema.Array(PluginPrivilege))(options.body ?? []),
            Effect.flatMap(voidClient),
            Effect.mapError((error) => new PluginsError({ method: "upgrade", error })),
            Effect.scoped
        );

    const create_ = (options: PluginCreateOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/create"),
            maybeAddQueryParameter("name", Option.some(options.name)),
            HttpClientRequest.streamBody(options.tarContext),
            voidClient,
            Effect.mapError((error) => new PluginsError({ method: "create", error })),
            Effect.scoped
        );

    const push_ = (options: PluginPushOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/push`),
            voidClient,
            Effect.mapError((error) => new PluginsError({ method: "push", error })),
            Effect.scoped
        );

    const set_ = (options: PluginSetOptions): Effect.Effect<void, PluginsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/${encodeURIComponent(options.name)}/set`),
            HttpClientRequest.schemaBody(Schema.Array(Schema.String))(options.body ?? []),
            Effect.flatMap(voidClient),
            Effect.mapError((error) => new PluginsError({ method: "set", error })),
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
});

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Plugins {
    readonly _: unique symbol;
}

/**
 * Plugins service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Plugins: Context.Tag<Plugins, PluginsImpl> = Context.GenericTag<Plugins, PluginsImpl>(
    "@the-moby-effect/moby/Plugins"
);

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Plugins, never, HttpClient.HttpClient.Default> = Layer.effect(Plugins, make);
