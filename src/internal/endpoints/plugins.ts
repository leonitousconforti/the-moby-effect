import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import { MobyConnectionOptions } from "../../MobyConnection.ts";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.ts";
import { JSONMessage, TypesPlugin as Plugin, RuntimePluginPrivilege as PluginPrivilege } from "../generated/index.ts";
import { WithRegistryAuthHeader } from "./auth.ts";
import { DockerError } from "./circular.ts";
import { InternalServerError, NotFound } from "./errors.ts";
import { BooleanFilter } from "./filters.ts";

/** @since 1.0.0 */
export const ListFilters = Schema.fromJsonString(
    Schema.Struct({
        capability: Schema.optional(Schema.Array(Schema.String)),
        enabled: BooleanFilter("enabled").pipe(Schema.optional),
    })
);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginList */
const listPluginsEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(ListFilters) },
    success: Schema.Array(Plugin), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/GetPluginPrivileges */
const getPrivilegesEndpoint = HttpApiEndpoint.get("getPrivileges", "/privileges", {
    query: { remote: Schema.String },
    success: Schema.Array(PluginPrivilege), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginPull */
const pullPluginEndpoint = HttpApiEndpoint.post("pull", "/pull", {
    query: { remote: Schema.String, name: Schema.optional(Schema.String) },
    headers: { "X-Registry-Auth": Schema.optional(Schema.String) },
    payload: Schema.Array(PluginPrivilege),
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginInspect */
const inspectPluginEndpoint = HttpApiEndpoint.get("inspect", "/:name/json", {
    params: { name: Schema.String },
    success: Plugin, // 200 OK
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginDelete */
const deletePluginEndpoint = HttpApiEndpoint.delete("delete", "/:name", {
    params: { name: Schema.String },
    query: { force: Schema.optional(Schema.Boolean) },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginEnable */
const enablePluginEndpoint = HttpApiEndpoint.post("enable", "/:name/enable", {
    params: { name: Schema.String },
    query: { timeout: Schema.optional(Schema.Number) },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginDisable */
const disablePluginEndpoint = HttpApiEndpoint.post("disable", "/:name/disable", {
    params: { name: Schema.String },
    query: { force: Schema.optional(Schema.Boolean) },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginUpgrade */
const upgradePluginEndpoint = HttpApiEndpoint.post("upgrade", "/:name/upgrade", {
    params: { name: Schema.String },
    query: { remote: Schema.String },
    headers: { "X-Registry-Auth": Schema.optional(Schema.String) },
    payload: Schema.Array(PluginPrivilege),
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming json progress response)
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginCreate */
const createPluginEndpoint = HttpApiEndpoint.post("create", "/create", {
    query: { name: Schema.String },
    payload: HttpApiSchema.StreamUint8Array(),
    success: HttpApiSchema.NoContent, // 204 No Content
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginPush */
const pushPluginEndpoint = HttpApiEndpoint.post("push", "/:name/push", {
    params: { name: Schema.String },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin/operation/PluginSet */
const setPluginEndpoint = HttpApiEndpoint.post("set", "/:name/set", {
    params: { name: Schema.String },
    payload: Schema.Array(Schema.String),
    success: HttpApiSchema.NoContent, // 204 No Content
    error: [
        NotFound, // 404 No such plugin
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin */
const PluginsGroup = HttpApiGroup.make("plugins")
    .add(
        listPluginsEndpoint,
        getPrivilegesEndpoint,
        pullPluginEndpoint,
        inspectPluginEndpoint,
        deletePluginEndpoint,
        enablePluginEndpoint,
        disablePluginEndpoint,
        upgradePluginEndpoint,
        createPluginEndpoint,
        pushPluginEndpoint,
        setPluginEndpoint
    )
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
export class Plugins extends Context.Service<Plugins>()("@the-moby-effect/endpoints/Plugins", {
    make: Effect.gen(function* () {
        type PluginsEndpoints = HttpApiGroup.Endpoints<typeof PluginsGroup>;
        type Options<Name extends PluginsEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            PluginsEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* Effect.map(
            HttpClient.HttpClient,
            WithRegistryAuthHeader(pullPluginEndpoint, upgradePluginEndpoint)
        );

        const PluginsError = DockerError.WrapForModule("plugins");
        const client = yield* HttpApiClient.group(PluginsApi, { group: "plugins", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof ListFilters> | undefined) =>
            client.list({ query: { filters } }).pipe(Effect.mapError(PluginsError("list")));
        const getPrivileges_ = (remote: string) =>
            client.getPrivileges({ query: { remote } }).pipe(Effect.mapError(PluginsError("getPrivileges")));
        const pull_ = (
            remote: string,
            options?: {
                name?: string | undefined;
                privileges?: Array<(typeof PluginPrivilege)["~type.make.in"]> | undefined;
            }
        ) =>
            Effect.forEach(options?.privileges ?? [], (privilege) => PluginPrivilege.makeEffect(privilege)).pipe(
                Effect.flatMap((payload) =>
                    client.pull({
                        headers: {},
                        query: { remote, name: options?.name },
                        payload,
                    })
                ),
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => Schema.decodeEffect(Schema.fromJsonString(JSONMessage))(line)),
                Stream.mapError(PluginsError("pull"))
            );
        const inspect_ = (name: string) =>
            client.inspect({ params: { name } }).pipe(Effect.mapError(PluginsError("inspect")));
        const delete_ = (name: string, options?: Options<"delete">) =>
            client.delete({ params: { name }, query: { ...options } }).pipe(Effect.mapError(PluginsError("delete")));
        const enable_ = (name: string, options?: Options<"enable">) =>
            client
                .enable({
                    params: { name },
                    query: { timeout: options?.timeout ?? 0 },
                })
                .pipe(Effect.mapError(PluginsError("enable")));
        const disable_ = (name: string, options?: Options<"disable">) =>
            client.disable({ params: { name }, query: { ...options } }).pipe(Effect.mapError(PluginsError("disable")));
        const upgrade_ = (
            name: string,
            remote: string,
            privileges?: Array<(typeof PluginPrivilege)["~type.make.in"]> | undefined
        ) =>
            Effect.forEach(privileges ?? [], (privilege) => PluginPrivilege.makeEffect(privilege)).pipe(
                Effect.flatMap((payload) =>
                    client.upgrade({
                        headers: {},
                        params: { name },
                        query: { remote },
                        payload,
                    })
                ),
                // The daemon streams json progress messages while it downloads
                // the new plugin version - drain them so the effect completes
                // only once the upgrade has actually finished.
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => Schema.decodeEffect(Schema.fromJsonString(JSONMessage))(line)),
                Stream.runDrain,
                Effect.mapError(PluginsError("upgrade"))
            );
        const create_ = <E, R>(name: string, tar: Stream.Stream<Uint8Array, E, R>) =>
            Effect.contextWith((context: Context.Context<R>) =>
                client.create({ query: { name }, payload: Stream.provideContext(tar, context) })
            ).pipe(Effect.mapError(PluginsError("create")));
        const push_ = (name: string) => client.push({ params: { name } }).pipe(Effect.mapError(PluginsError("push")));
        const set_ = (name: string, body: ReadonlyArray<string>) =>
            client.set({ params: { name }, payload: body }).pipe(Effect.mapError(PluginsError("set")));

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
export const PluginsLayer: Layer.Layer<Plugins, never, HttpClient.HttpClient> = Layer.effect(Plugins, Plugins.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Plugin
 */
export const PluginsLayerLocalSocket: Layer.Layer<Plugins, never, HttpClient.HttpClient> = PluginsLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
