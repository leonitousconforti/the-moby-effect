/**
 * @since 1.0.0
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Plugin
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import { Plugin, PluginPrivilege } from "../generated/index.js";
import { maybeAddHeader, maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export const PluginsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/PluginsError");

/**
 * @since 1.0.0
 * @category Errors
 * @internal
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
export class PluginsError extends PlatformError.TypeIdError(PluginsErrorTypeId, "PluginsError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Plugins service
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Plugin
 */
export class Plugins extends Effect.Service<Plugins>()("@the-moby-effect/endpoints/Plugins", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginList */
        const list_ = (
            options?: { readonly filters?: { compatibility?: [string]; enable?: ["true" | "false"] } } | undefined
        ): Effect.Effect<Readonly<Array<Plugin>>, PluginsError> =>
            Function.pipe(
                HttpClientRequest.get("/plugins"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(Plugin))),
                Effect.mapError((cause) => new PluginsError({ method: "list", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/GetPluginPrivileges */
        const getPrivileges_ = (remote: string): Effect.Effect<Readonly<Array<PluginPrivilege>>, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/plugins/privileges"),
                maybeAddQueryParameter("remote", Option.some(remote)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(PluginPrivilege))),
                Effect.mapError((cause) => new PluginsError({ method: "getPrivileges", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginPull */
        const pull_ = (
            remote: string,
            options?:
                | {
                      readonly name?: string;
                      readonly "X-Registry-Auth"?: string;
                      readonly body?: Array<PluginPrivilege>;
                  }
                | undefined
        ): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/plugins/pull"),
                HttpClientRequest.setHeader("X-Registry-Auth", ""),
                maybeAddQueryParameter("remote", Option.some(remote)),
                maybeAddQueryParameter("name", Option.fromNullable(options?.name)),
                HttpClientRequest.schemaBodyJson(Schema.Array(PluginPrivilege))(options?.body ?? []),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "pull", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginInspect */
        const inspect_ = (name: string): Effect.Effect<Readonly<Plugin>, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/plugins/${encodeURIComponent(name)}/json`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Plugin)),
                Effect.mapError((cause) => new PluginsError({ method: "inspect", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginDelete */
        const delete_ = (
            name: string,
            options?:
                | {
                      readonly force?: boolean;
                  }
                | undefined
        ): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/plugins/${encodeURIComponent(name)}`),
                maybeAddQueryParameter("force", Option.fromNullable(options?.force)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "delete", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginEnable */
        const enable_ = (
            name: string,
            options?:
                | {
                      readonly timeout?: number;
                  }
                | undefined
        ): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/plugins/${encodeURIComponent(name)}/enable`),
                maybeAddQueryParameter("timeout", Option.fromNullable(options?.timeout)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "enable", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginDisable */
        const disable_ = (
            name: string,
            options?:
                | {
                      readonly force?: boolean;
                  }
                | undefined
        ): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/plugins/${encodeURIComponent(name)}/disable`),
                maybeAddQueryParameter("force", Option.fromNullable(options?.force)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "disable", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginUpgrade */
        const upgrade_ = (options: {
            readonly name: string;
            readonly remote: string;
            readonly "X-Registry-Auth"?: string;
            readonly body?: Array<PluginPrivilege>;
        }): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/plugins/${encodeURIComponent(options.name)}/upgrade`),
                maybeAddHeader("X-Registry-Auth", Option.fromNullable(options["X-Registry-Auth"])),
                maybeAddQueryParameter("remote", Option.some(options.remote)),
                HttpClientRequest.schemaBodyJson(Schema.Array(PluginPrivilege))(options.body ?? []),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "upgrade", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginCreate */
        const create_ = <E1>(
            name: string,
            tarContext: Stream.Stream<Uint8Array, E1, never>
        ): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/plugins/create"),
                maybeAddQueryParameter("name", Option.some(name)),
                HttpClientRequest.bodyStream(tarContext),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "create", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginPush */
        const push_ = (name: string): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/plugins/${encodeURIComponent(name)}/push`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "push", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/version/v1.47/#tag/Plugin/operation/PluginSet */
        const set_ = (
            name: string,
            options?:
                | {
                      readonly body?: Array<string>;
                  }
                | undefined
        ): Effect.Effect<void, PluginsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/plugins/${encodeURIComponent(name)}/set`),
                HttpClientRequest.schemaBodyJson(Schema.Array(Schema.String))(options?.body ?? []),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new PluginsError({ method: "set", cause })),
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
    }),
}) {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Plugin
 */
export const PluginsLayer: Layer.Layer<Plugins, never, HttpClient.HttpClient> = Plugins.Default;
