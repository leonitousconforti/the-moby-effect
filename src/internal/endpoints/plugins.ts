import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpApiSchema, HttpClient } from "@effect/platform";
import { Array, Effect, ParseResult, Schema, Stream, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { mapError } from "../convey/sinks.ts";
import { JSONMessage, TypesPlugin as Plugin, RuntimePluginPrivilege as PluginPrivilege } from "../generated/index.js";
import { WithRegistryAuthHeader } from "./auth.ts";
import { DockerError } from "./circular.ts";
import { HttpApiStreamingRequest, HttpApiStreamingResponse, InternalServerError, NotFound } from "./httpApiHacks.js";

/** @since 1.0.0 */
export class ListFilters extends Schema.parseJson(
    Schema.Struct({
        capability: Schema.optional(Schema.Array(Schema.String)),
        enabled: Schema.transformOrFail(Schema.Tuple(Schema.String), Schema.BooleanFromString, {
            decode: (_fromA, _options, ast) =>
                ParseResult.fail(new ParseResult.Forbidden(ast, _fromA, "Decoding 'enabled' filter is not supported")),
            encode: (automated) => ParseResult.succeed([automated] as const),
        }).pipe(Schema.optional),
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
    .addSuccess(HttpApiSchema.Empty(200))
    .addSuccess(HttpApiSchema.Empty(204)); // 204 No Content

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginInspect */
const inspectPluginEndpoint = HttpApiEndpoint.get("inspect", "/:name/json")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(Plugin, { status: 200 })
    .addError(NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginDelete */
const deletePluginEndpoint = HttpApiEndpoint.del("delete", "/:name")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginEnable */
const enablePluginEndpoint = HttpApiEndpoint.post("enable", "/:name/enable")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ timeout: Schema.optional(Schema.NumberFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginDisable */
const disablePluginEndpoint = HttpApiEndpoint.post("disable", "/:name/disable")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ force: Schema.optional(Schema.BooleanFromString) }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginUpgrade */
const upgradePluginEndpoint = HttpApiEndpoint.post("upgrade", "/:name/upgrade")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setUrlParams(Schema.Struct({ remote: Schema.String }))
    .setHeaders(Schema.Struct({ "X-Registry-Auth": Schema.optional(Schema.String) }))
    .setPayload(Schema.Array(PluginPrivilege))
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addSuccess(HttpApiSchema.Empty(204)) // 204 No Content
    .addError(NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginCreate */
const createPluginEndpoint = HttpApiEndpoint.post("create", "/create")
    .setUrlParams(Schema.Struct({ name: Schema.String }))
    .addSuccess(HttpApiSchema.NoContent); // 204 No Content

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginPush */
const pushPluginEndpoint = HttpApiEndpoint.post("push", "/:name/push")
    .setPath(Schema.Struct({ name: Schema.String }))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(NotFound); // 404 No such plugin

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginSet */
const setPluginEndpoint = HttpApiEndpoint.post("set", "/:name/set")
    .setPath(Schema.Struct({ name: Schema.String }))
    .setPayload(Schema.Array(Schema.String))
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(NotFound); // 404 No such plugin

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
    .addError(InternalServerError)
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

        const httpClient = yield* Effect.map(
            HttpClient.HttpClient,
            WithRegistryAuthHeader(pullPluginEndpoint, upgradePluginEndpoint)
        );

        const PluginsError = DockerError.WrapForModule("plugins");
        const client = yield* HttpApiClient.group(PluginsApi, { group: "plugins", httpClient });

        const list_ = (filters?: Schema.Schema.Type<ListFilters> | undefined) =>
            Effect.mapError(client.list({ urlParams: { filters } }), PluginsError("list"));
        const getPrivileges_ = (remote: string) =>
            Effect.mapError(client.getPrivileges({ urlParams: { remote } }), PluginsError("getPrivileges"));
        const pull_ = (
            remote: string,
            options?: {
                name?: string | undefined;
                privileges?: Array<ConstructorParameters<typeof PluginPrivilege>[0]> | undefined;
            }
        ) =>
            HttpApiStreamingResponse(
                PluginsApi,
                "plugins",
                "pull",
                httpClient
            )({
                headers: {},
                urlParams: { remote, name: options?.name },
                payload: Array.map(options?.privileges ?? [], (privilege) => PluginPrivilege.make(privilege)),
            })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapEffect(Schema.decode(Schema.parseJson(JSONMessage))))
                .pipe(mapError)
                .pipe(Stream.mapError(PluginsError("pull")));
        const inspect_ = (name: string) => Effect.mapError(client.inspect({ path: { name } }), PluginsError("inspect"));
        const delete_ = (name: string, options?: Options<"delete">) =>
            Effect.mapError(client.delete({ path: { name }, urlParams: { ...options } }), PluginsError("delete"));
        const enable_ = (name: string, options?: Options<"enable">) =>
            Effect.mapError(
                client.enable({
                    path: { name },
                    urlParams: { timeout: options?.timeout ?? 0 },
                }),
                PluginsError("enable")
            );
        const disable_ = (name: string, options?: Options<"disable">) =>
            Effect.mapError(client.disable({ path: { name }, urlParams: { ...options } }), PluginsError("disable"));
        const upgrade_ = (
            name: string,
            remote: string,
            privileges?: Array<ConstructorParameters<typeof PluginPrivilege>[0]> | undefined
        ) =>
            Effect.mapError(
                client.upgrade({
                    headers: {},
                    path: { name },
                    urlParams: { remote },
                    payload: Array.map(privileges ?? [], (privilege) => PluginPrivilege.make(privilege)),
                }),
                PluginsError("upgrade")
            );
        const create_ = <E, R>(name: string, tar: Stream.Stream<Uint8Array, E, R>) =>
            Effect.mapError(
                HttpApiStreamingRequest(PluginsApi, "plugins", "create", httpClient, tar)({ urlParams: { name } }),
                PluginsError("create")
            );
        const push_ = (name: string) => Effect.mapError(client.push({ path: { name } }), PluginsError("push"));
        const set_ = (name: string, body: ReadonlyArray<string>) =>
            Effect.mapError(client.set({ path: { name }, payload: body }), PluginsError("set"));

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
