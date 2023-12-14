/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Context, Data, Effect, Layer, pipe } from "effect";
import { MobyConnectionAgent } from "./agent-helpers.js";
import { addHeader, addQueryParameter, responseErrorHandler2 } from "./request-helpers.js";
import { Config, ConfigSpec, IDResponse } from "./schemas.js";

export class ConfigsError extends Data.TaggedError("ConfigsError")<{
    method: string;
    message: string;
}> {}

const errorHandler = (method: string) => responseErrorHandler2((message) => new ConfigsError({ method, message }));

export interface ConfigDeleteOptions {
    /** ID of the config */
    readonly id: string;
}

export interface ConfigInspectOptions {
    /** ID of the config */
    readonly id: string;
}

export interface ConfigListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the configs list. Available filters:
     *
     * - `id=<config id>`
     * - `label=<key> or label=<key>=value`
     * - `name=<config name>`
     * - `names=<config name>`
     */
    readonly filters?: string;
}

export interface ConfigUpdateOptions {
    /** The ID or name of the config */
    readonly id: string;
    /**
     * The version number of the config object being updated. This is required
     * to avoid conflicting writes.
     */
    readonly version: number;
    /**
     * The spec of the config to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the [ConfigInspect
     * endpoint](#operation/ConfigInspect) response values.
     */
    readonly spec?: ConfigSpec;
}

const make = Effect.gen(function* (_) {
    const agent = yield* _(MobyConnectionAgent);
    const defaultClient = yield* _(NodeHttp.client.Client);

    const client = defaultClient.pipe(
        NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(agent.nodeRequestUrl + "/configs")),
        NodeHttp.client.filterStatusOk
    );
    const voidClient = client.pipe(NodeHttp.client.transform(Effect.asUnit));
    const IDClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(IDResponse)));
    const ConfigClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Config)));
    const ConfigsClient = client.pipe(
        NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Config)))
    );

    const create = (options: Config): Effect.Effect<never, ConfigsError, IDResponse> =>
        pipe(
            NodeHttp.request.post("/create"),
            NodeHttp.request.schemaBody(Config)(options),
            Effect.flatMap(IDClient),
            Effect.catchAll(errorHandler("create"))
        );

    const delete_ = (options: ConfigDeleteOptions): Effect.Effect<never, ConfigsError, void> =>
        pipe(
            NodeHttp.request.del(`/${encodeURIComponent(options.id)}`),
            voidClient,
            Effect.catchAll(errorHandler("delete"))
        );

    const inspect = (options: ConfigInspectOptions): Effect.Effect<never, ConfigsError, Config> =>
        pipe(
            NodeHttp.request.get(`/${encodeURIComponent(options.id)}`),
            ConfigClient,
            Effect.catchAll(errorHandler("inspect"))
        );

    const list = (options?: ConfigListOptions | undefined): Effect.Effect<never, ConfigsError, ReadonlyArray<Config>> =>
        pipe(
            NodeHttp.request.get(""),
            addQueryParameter("filters", options?.filters),
            ConfigsClient,
            Effect.catchAll(errorHandler("list"))
        );

    const update = (options: ConfigUpdateOptions): Effect.Effect<never, ConfigsError, void> =>
        pipe(
            NodeHttp.request.post(`/${encodeURIComponent(options.id)}/update`),
            addQueryParameter("version", options.version),
            addHeader("Content-Type", "application/json"),
            NodeHttp.request.schemaBody(ConfigSpec)(options.spec ?? new ConfigSpec({})),
            Effect.catchAll(errorHandler("update"))
        );

    return { create, delete: delete_, inspect, list, update } as const;
});

export interface Configs {
    /**
     * Create a config
     *
     * @param name - User-defined name of the config
     * @param labels - User-defined key/value metadata
     * @param data - Base64-url-safe-encoded ([RFC 4648 section
     *   5](https://tools.ietf.org/html/rfc4648#section-5)) config data
     * @param templating -
     */
    readonly create: (options: Config) => Effect.Effect<never, ConfigsError, IDResponse>;

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
    readonly inspect: (options: ConfigInspectOptions) => Effect.Effect<never, ConfigsError, Config>;

    /**
     * List configs
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the configs list. Available
     *   filters:
     *
     *   - `id=<config id>`
     *   - `label=<key> or label=<key>=value`
     *   - `name=<config name>`
     *   - `names=<config name>`
     */
    readonly list: (
        options?: ConfigListOptions | undefined
    ) => Effect.Effect<never, ConfigsError, ReadonlyArray<Config>>;

    /**
     * Update a Config
     *
     * @param id - The ID or name of the config
     * @param version - The version number of the config object being updated.
     *   This is required to avoid conflicting writes.
     * @param spec - The spec of the config to update. Currently, only the
     *   Labels field can be updated. All other fields must remain unchanged
     *   from the [ConfigInspect endpoint](#operation/ConfigInspect) response
     *   values.
     */
    readonly update: (options: ConfigUpdateOptions) => Effect.Effect<never, ConfigsError, void>;
}

export const Configs = Context.Tag<Configs>("moby/Configs");

export const layer = Layer.effect(Configs, make).pipe(Layer.provide(NodeHttp.nodeClient.layer));
