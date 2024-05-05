import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./Agent.js";
import { addQueryParameter, responseErrorHandler } from "./Requests.js";
import { Config, ConfigSpec, IDResponse } from "./Schemas.js";

export class ConfigsError extends Data.TaggedError("ConfigsError")<{
    method: string;
    message: string;
}> {}

export interface ConfigListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the configs list.
     *
     * Available filters:
     *
     * - `id=<config id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<config name>`
     * - `names=<config name>`
     */
    readonly filters?: {
        id?: [string] | undefined;
        label?: string[] | undefined;
        name?: [string] | undefined;
        names?: [string] | undefined;
    };
}

export interface ConfigDeleteOptions {
    /** ID of the config */
    readonly id: string;
}

export interface ConfigInspectOptions {
    /** ID of the config */
    readonly id: string;
}

export interface ConfigUpdateOptions {
    /** The ID or name of the config */
    readonly id: string;
    /**
     * The spec of the config to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [ConfigInspect
     * endpoint](#operation/ConfigInspect) response values.
     */
    readonly spec: Schema.Schema.Encoded<typeof ConfigSpec>;
    /**
     * The version number of the config object being updated. This is required
     * to avoid conflicting writes.
     */
    readonly version: number;
}

export interface Configs {
    /**
     * List configs
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the configs list.
     *
     *   Available filters:
     *
     *   - `id=<config id>`
     *   - `label=<key> or label=<key>=value`
     *   - `name=<config name>`
     *   - `names=<config name>`
     */
    readonly list: (
        options?: ConfigListOptions | undefined
    ) => Effect.Effect<Readonly<Array<Config>>, ConfigsError, never>;

    /**
     * Create a config
     *
     * @param body -
     */
    readonly create: (
        options: Schema.Schema.Encoded<typeof ConfigSpec>
    ) => Effect.Effect<Readonly<IDResponse>, ConfigsError, never>;

    /**
     * Delete a config
     *
     * @param id - ID of the config
     */
    readonly delete: (options: ConfigDeleteOptions) => Effect.Effect<void, ConfigsError, never>;

    /**
     * Inspect a config
     *
     * @param id - ID of the config
     */
    readonly inspect: (options: ConfigInspectOptions) => Effect.Effect<Readonly<Config>, ConfigsError, never>;

    /**
     * Update a Config
     *
     * @param id - The ID or name of the config
     * @param spec - The spec of the config to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [ConfigInspect endpoint](#operation/ConfigInspect) response
     *   values.
     * @param version - The version number of the config object being updated.
     *   This is required to avoid conflicting writes.
     */
    readonly update: (options: ConfigUpdateOptions) => Effect.Effect<void, ConfigsError, never>;
}

const make: Effect.Effect<Configs, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/configs`)),
            HttpClient.client.filterStatusOk
        );

        const voidClient = client.pipe(HttpClient.client.transform(Effect.asVoid));
        const ConfigClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Config)));
        const IDResponseClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(IDResponse))
        );
        const ConfigsClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.Array(Config)))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ConfigsError({ method, message }));

        const list_ = (
            options?: ConfigListOptions | undefined
        ): Effect.Effect<Readonly<Array<Config>>, ConfigsError, never> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                ConfigsClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const create_ = (
            options: Schema.Schema.Encoded<typeof ConfigSpec>
        ): Effect.Effect<Readonly<IDResponse>, ConfigsError, never> =>
            Function.pipe(
                HttpClient.request.post("/create"),
                HttpClient.request.schemaBody(ConfigSpec)(new ConfigSpec(options)),
                Effect.flatMap(IDResponseClient),
                Effect.catchAll(responseHandler("create")),
                Effect.scoped
            );

        const delete_ = (options: ConfigDeleteOptions): Effect.Effect<void, ConfigsError, never> =>
            Function.pipe(
                HttpClient.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete")),
                Effect.scoped
            );

        const inspect_ = (options: ConfigInspectOptions): Effect.Effect<Readonly<Config>, ConfigsError, never> =>
            Function.pipe(
                HttpClient.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                ConfigClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const update_ = (options: ConfigUpdateOptions): Effect.Effect<void, ConfigsError, never> =>
            Function.pipe(
                HttpClient.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("version", options.version),
                HttpClient.request.schemaBody(ConfigSpec)(new ConfigSpec(options.spec)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update")),
                Effect.scoped
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_ };
    }
);

export const Configs = Context.GenericTag<Configs>("the-moby-effect/Configs");
export const layer = Layer.effect(Configs, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
