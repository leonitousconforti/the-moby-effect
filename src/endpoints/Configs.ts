/**
 * Configs service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Tuple from "effect/Tuple";

import { SwarmConfig, SwarmConfigCreateResponse, SwarmConfigSpec } from "../generated/index.js";
import { maybeAddFilters, maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ConfigsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/ConfigsError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type ConfigsErrorTypeId = typeof ConfigsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isConfigsError = (u: unknown): u is ConfigsError => Predicate.hasProperty(u, ConfigsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ConfigsError extends PlatformError.TypeIdError(ConfigsErrorTypeId, "ConfigsError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ConfigListOptions {
    readonly filters?: {
        name?: string | undefined;
        id?: string | undefined;
        names?: string | undefined;
        label?: Record<string, string> | undefined;
    };
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ConfigDeleteOptions {
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ConfigInspectOptions {
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ConfigUpdateOptions {
    /** The ID or name of the config */
    readonly id: string;
    /**
     * The spec of the config to update. Currently, only the Labels field can be
     * updated. All other fields must remain unchanged from the ConfigInspect
     * response values.
     */
    readonly spec: SwarmConfigSpec;
    /**
     * The version number of the config object being updated. This is required
     * to avoid conflicting writes.
     */
    readonly version: number;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface ConfigsImpl {
    readonly list: (
        options?: ConfigListOptions | undefined
    ) => Effect.Effect<ReadonlyArray<SwarmConfig>, ConfigsError, never>;
    readonly create: (
        options: SwarmConfigSpec
    ) => Effect.Effect<Readonly<SwarmConfigCreateResponse>, ConfigsError, never>;
    readonly delete: (options: ConfigDeleteOptions) => Effect.Effect<void, ConfigsError, never>;
    readonly inspect: (options: ConfigInspectOptions) => Effect.Effect<Readonly<SwarmConfig>, ConfigsError, never>;

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

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<ConfigsImpl, never, HttpClient.HttpClient.Service> = Effect.gen(function* () {
    const contextClient = yield* HttpClient.HttpClient;
    const client = contextClient.pipe(HttpClient.filterStatusOk);

    const list_ = (
        options?: ConfigListOptions | undefined
    ): Effect.Effect<ReadonlyArray<SwarmConfig>, ConfigsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/configs"),
            maybeAddFilters(options?.filters),
            client.execute,
            Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmConfig))),
            Effect.mapError((cause) => new ConfigsError({ method: "list", cause })),
            Effect.scoped
        );

    const create_ = (
        options: Schema.Schema.Encoded<typeof SwarmConfigSpec>
    ): Effect.Effect<Readonly<SwarmConfigCreateResponse>, ConfigsError, never> =>
        Function.pipe(
            Schema.decode(SwarmConfigSpec)(options),
            Effect.map((body) => Tuple.make(HttpClientRequest.post("/configs/create"), body)),
            Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmConfigSpec))),
            Effect.flatMap(client.execute),
            Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmConfigCreateResponse)),
            Effect.mapError((cause) => new ConfigsError({ method: "create", cause })),
            Effect.scoped
        );

    const delete_ = (options: ConfigDeleteOptions): Effect.Effect<void, ConfigsError, never> =>
        Function.pipe(
            HttpClientRequest.del(`/configs/${encodeURIComponent(options.id)}`),
            client.execute,
            Effect.asVoid,
            Effect.mapError((cause) => new ConfigsError({ method: "delete", cause })),
            Effect.scoped
        );

    const inspect_ = (options: ConfigInspectOptions): Effect.Effect<Readonly<SwarmConfig>, ConfigsError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/configs/${encodeURIComponent(options.id)}`),
            client.execute,
            Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmConfig)),
            Effect.mapError((cause) => new ConfigsError({ method: "inspect", cause })),
            Effect.scoped
        );

    const update_ = (options: ConfigUpdateOptions): Effect.Effect<void, ConfigsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/configs/${encodeURIComponent(options.id)}/update`),
            maybeAddQueryParameter("version", Option.some(options.version)),
            HttpClientRequest.schemaBodyJson(SwarmConfigSpec)(options.spec),
            Effect.flatMap(client.execute),
            Effect.asVoid,
            Effect.mapError((cause) => new ConfigsError({ method: "update", cause })),
            Effect.scoped
        );

    return {
        list: list_,
        create: create_,
        delete: delete_,
        inspect: inspect_,
        update: update_,
    };
});

/**
 * Configs service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Configs extends Effect.Tag("@the-moby-effect/endpoints/Configs")<Configs, ConfigsImpl>() {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Configs, never, HttpClient.HttpClient.Service> = Layer.effect(Configs, make);
