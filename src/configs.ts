import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Context, Data, Effect, Layer, Scope, pipe } from "effect";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler } from "./request-helpers.js";
import { Config, ConfigSpec, IDResponse } from "./schemas.js";

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
    readonly spec: Schema.Schema.To<typeof ConfigSpec.struct>;
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
    ) => Effect.Effect<never, ConfigsError, Readonly<Array<Config>>>;

    /**
     * Create a config
     *
     * @param body -
     */
    readonly create: (
        options: Schema.Schema.To<typeof ConfigSpec.struct>
    ) => Effect.Effect<never, ConfigsError, Readonly<IDResponse>>;

    /**
     * Delete a config
     *
     * @param id - ID of the config
     */
    readonly delete: (options: ConfigDeleteOptions) => Effect.Effect<never, ConfigsError, void>;

    /**
     * Inspect a config
     *
     * @param id - ID of the config
     */
    readonly inspect: (options: ConfigInspectOptions) => Effect.Effect<never, ConfigsError, Readonly<Config>>;

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
    readonly update: (options: ConfigUpdateOptions) => Effect.Effect<never, ConfigsError, void>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Configs> = Effect.gen(
    function* (_: Effect.Adapter) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(NodeHttp.client.Client);

        const client = defaultClient.pipe(
            NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/configs`)),
            NodeHttp.client.filterStatusOk
        );

        const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
        const ConfigClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Config)));
        const IDResponseClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(IDResponse)));
        const ConfigsClient = client.pipe(
            NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Config)))
        );

        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new ConfigsError({ method, message }));

        const list_ = (
            options?: ConfigListOptions | undefined
        ): Effect.Effect<never, ConfigsError, Readonly<Array<Config>>> =>
            pipe(
                NodeHttp.request.get(""),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                ConfigsClient,
                Effect.catchAll(responseHandler("list"))
            );

        const create_ = (
            options: Schema.Schema.To<typeof ConfigSpec.struct>
        ): Effect.Effect<never, ConfigsError, Readonly<IDResponse>> =>
            pipe(
                NodeHttp.request.post("/create"),
                NodeHttp.request.schemaBody(ConfigSpec)(new ConfigSpec(options)),
                Effect.flatMap(IDResponseClient),
                Effect.catchAll(responseHandler("create"))
            );

        const delete_ = (options: ConfigDeleteOptions): Effect.Effect<never, ConfigsError, void> =>
            pipe(
                NodeHttp.request.del("/{id}".replace("{id}", encodeURIComponent(options.id))),
                voidClient,
                Effect.catchAll(responseHandler("delete"))
            );

        const inspect_ = (options: ConfigInspectOptions): Effect.Effect<never, ConfigsError, Readonly<Config>> =>
            pipe(
                NodeHttp.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                ConfigClient,
                Effect.catchAll(responseHandler("inspect"))
            );

        const update_ = (options: ConfigUpdateOptions): Effect.Effect<never, ConfigsError, void> =>
            pipe(
                NodeHttp.request.post("/{id}/update".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("version", options.version),
                NodeHttp.request.schemaBody(ConfigSpec)(new ConfigSpec(options.spec)),
                Effect.flatMap(voidClient),
                Effect.catchAll(responseHandler("update"))
            );

        return { list: list_, create: create_, delete: delete_, inspect: inspect_, update: update_ };
    }
);

export const Configs = Context.Tag<Configs>("the-moby-effect/Configs");
export const layer = Layer.effect(Configs, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
