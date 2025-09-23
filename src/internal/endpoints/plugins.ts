import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
    Error as PlatformError,
    type HttpClientError,
} from "@effect/platform";
import { Effect, Predicate, Schema, type Layer, type ParseResult, type Stream } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { TypesPlugin as Plugin, RuntimePluginPrivilege as PluginPrivilege } from "../generated/index.js";
import { HttpApiStreamingRequest } from "./httpApiHacks.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const PluginsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/PluginsError"
) as PluginsErrorTypeId;

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
export class PluginsError extends PlatformError.TypeIdError(PluginsErrorTypeId, "PluginsError")<{
    method: string;
    cause:
        | HttpApiError.InternalServerError
        | HttpApiError.BadRequest
        | HttpApiError.NotFound
        | HttpApiError.Forbidden
        | HttpApiError.Conflict
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: PluginsError["cause"]) => new this({ method, cause });
    }
}

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        enabled: Schema.optional(Schema.BooleanFromString),
        capability: Schema.optional(Schema.String),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginList */
const listPluginsEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(ListFilters) }))
    .addSuccess(Schema.Array(Plugin), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/GetPluginPrivileges */
const getPrivilegesEndpoint = HttpApiEndpoint.get("getPrivileges", "/privileges")
    .setUrlParams(Schema.Struct({ remote: Schema.String }))
    .addSuccess(Schema.Array(PluginPrivilege), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginPull */
const pullPluginEndpoint = HttpApiEndpoint.post("pull", "/pull")
    .setUrlParams(Schema.Struct({ remote: Schema.String, name: Schema.optional(Schema.String) }))
    .setHeaders(Schema.Struct({ "X-Registry-Auth": Schema.optional(Schema.String) }))
    .setPayload(Schema.Array(PluginPrivilege))
    .addSuccess(HttpApiSchema.NoContent); // 204 No Content

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginInspect */
const inspectPluginEndpoint = HttpApiEndpoint.get("inspect", "/:name/json")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(Plugin, { status: 200 })
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginDelete */
const deletePluginEndpoint = HttpApiEndpoint.del("delete", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginEnable */
const enablePluginEndpoint = HttpApiEndpoint.post("enable", "/:name/enable")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ timeout: Schema.optional(Schema.NumberFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginDisable */
const disablePluginEndpoint = HttpApiEndpoint.post("disable", "/:name/disable")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginUpgrade */
const upgradePluginEndpoint = HttpApiEndpoint.post("upgrade", "/:name/upgrade")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ remote: Schema.String }))
    .setHeaders(Schema.Struct({ "X-Registry-Auth": Schema.optional(Schema.String) }))
    .setPayload(Schema.Array(PluginPrivilege))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginCreate */
const createPluginEndpoint = HttpApiEndpoint.post("create", "/create")
    .setUrlParams(Schema.Struct({ name: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent); // 204 No Content

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginPush */
const pushPluginEndpoint = HttpApiEndpoint.post("push", "/:name/push")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginSet */
const setPluginEndpoint = HttpApiEndpoint.post("set", "/:name/set")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setPayload(Schema.Array(Schema.String))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin */
const PluginsGroup = HttpApiGroup.make("plugins")
    .add(listPluginsEndpoint)
    .add(getPrivilegesEndpoint)
    .add(pullPluginEndpoint)
    .add(inspectPluginEndpoint)
    .add(deletePluginEndpoint)
    .add(enablePluginEndpoint)
    .add(disablePluginEndpoint)
    .add(upgradePluginEndpoint)
    .add(createPluginEndpoint)
    .add(pushPluginEndpoint)
    .add(setPluginEndpoint)
    .addError(HttpApiError.InternalServerError)
    .prefix("/plugins");

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
 */
export const PluginsApi = HttpApi.make("PluginsApi").add(PluginsGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
 */
export class Plugins extends Effect.Service<Plugins>()("@the-moby-effect/endpoints/Plugins", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof PluginsGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof PluginsGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(PluginsApi, { group: "plugins", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters> | undefined) =>
            Effect.mapError(client.list({ urlParams: { filters } }), PluginsError.WrapForMethod("list"));
        const getPrivileges_ = (remote: string) =>
            Effect.mapError(
                client.getPrivileges({ urlParams: { remote } }),
                PluginsError.WrapForMethod("getPrivileges")
            );
        const pull_ = (options: Options<"pull">, payload: Array<PluginPrivilege>) =>
            Effect.mapError(
                client.pull({
                    payload,
                    urlParams: { ...options },
                    headers: { "X-Registry-Auth": "" },
                }),
                PluginsError.WrapForMethod("pull")
            );
        const inspect_ = (name: string) =>
            Effect.mapError(client.inspect({ path: { name } }), PluginsError.WrapForMethod("inspect"));
        const delete_ = (name: string, options?: Options<"delete">) =>
            Effect.mapError(
                client.delete({ path: { name }, urlParams: { ...options } }),
                PluginsError.WrapForMethod("delete")
            );
        const enable_ = (name: string, options?: Options<"enable">) =>
            Effect.mapError(
                client.enable({ path: { name }, urlParams: { ...options } }),
                PluginsError.WrapForMethod("enable")
            );
        const disable_ = (name: string, options?: Options<"disable">) =>
            Effect.mapError(
                client.disable({ path: { name }, urlParams: { ...options } }),
                PluginsError.WrapForMethod("disable")
            );
        const upgrade_ = (name: string, remote: string, payload: Array<PluginPrivilege>) =>
            Effect.mapError(
                client.upgrade({
                    payload,
                    path: { name },
                    urlParams: { remote },
                    headers: { "X-Registry-Auth": "" },
                }),
                PluginsError.WrapForMethod("upgrade")
            );
        const create_ = <E, R>(name: string, tar: Stream.Stream<Uint8Array, E, R>) =>
            Effect.mapError(
                HttpApiStreamingRequest(PluginsApi, "plugins", "create", httpClient, tar)({ urlParams: { name } }),
                PluginsError.WrapForMethod("create")
            );
        const push_ = (name: string) =>
            Effect.mapError(client.push({ path: { name } }), PluginsError.WrapForMethod("push"));
        const set_ = (name: string, body: ReadonlyArray<string>) =>
            Effect.mapError(client.set({ path: { name }, payload: body }), PluginsError.WrapForMethod("set"));

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
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
 */
export const PluginsLayerLocalSocket: Layer.Layer<Plugins, never, HttpClient.HttpClient> = Plugins.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
 */
export const PluginsLayer: Layer.Layer<Plugins, never, HttpClient.HttpClient> = Plugins.DefaultWithoutDependencies;
