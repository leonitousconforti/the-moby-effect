import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
} from "@effect/platform";
import { Effect, Schema, type Layer, type Stream } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { Plugin, PluginPrivilege } from "../generated/index.js";
import { HttpApiStreamingRequest } from "./httpApiHacks.js";

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
            client.list({ urlParams: { filters } });
        const getPrivileges_ = (remote: string) => client.getPrivileges({ urlParams: { remote } });
        const pull_ = (options: Options<"pull">, payload: Array<PluginPrivilege>) =>
            client.pull({
                payload,
                urlParams: { ...options },
                headers: { "X-Registry-Auth": "" },
            });
        const inspect_ = (name: string) => client.inspect({ path: { name } });
        const delete_ = (name: string, options?: Options<"delete">) =>
            client.delete({ path: { name }, urlParams: { ...options } });
        const enable_ = (name: string, options?: Options<"enable">) =>
            client.enable({ path: { name }, urlParams: { ...options } });
        const disable_ = (name: string, options?: Options<"disable">) =>
            client.disable({ path: { name }, urlParams: { ...options } });
        const upgrade_ = (name: string, remote: string, payload: Array<PluginPrivilege>) =>
            client.upgrade({
                payload,
                path: { name },
                urlParams: { remote },
                headers: { "X-Registry-Auth": "" },
            });
        const create_ = <E>(name: string, tar: Stream.Stream<Uint8Array, E, never>) =>
            HttpApiStreamingRequest(PluginsApi, "plugins", "create", httpClient, tar)({ urlParams: { name } });
        const push_ = (name: string) => client.push({ path: { name } });
        const set_ = (name: string, body: ReadonlyArray<string>) => client.set({ path: { name }, payload: body });

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
