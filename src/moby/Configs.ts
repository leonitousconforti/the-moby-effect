/**
 * Configs service
 *
 * @since 1.0.0
 * @see https://docs.docker.com/engine/api/v1.45/#tag/Config
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
import * as Scope from "effect/Scope";

import {
    IMobyConnectionAgent,
    IMobyConnectionAgentImpl,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "../Agent.js";
import { maybeAddQueryParameter } from "../Requests.js";
import { Config, ConfigSpec, IdResponse } from "../Schemas.js";

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
export class ConfigsError extends PlatformError.RefailError(ConfigsErrorTypeId, "ConfigsError")<{
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
export interface ConfigListOptions {
    readonly filters?: {
        name?: [string] | undefined;
        id?: Array<string> | undefined;
        names?: Array<string> | undefined;
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
    readonly spec: ConfigSpec;
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
    ) => Effect.Effect<ReadonlyArray<Config>, ConfigsError, never>;
    readonly create: (options: ConfigSpec) => Effect.Effect<Readonly<IdResponse>, ConfigsError, never>;
    readonly delete: (options: ConfigDeleteOptions) => Effect.Effect<void, ConfigsError, never>;
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

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<ConfigsImpl, never, IMobyConnectionAgent | HttpClient.HttpClient.Default> = Effect.gen(
    function* () {
        const agent = yield* MobyConnectionAgent;
        const defaultClient = yield* HttpClient.HttpClient;

        const client = defaultClient.pipe(
            HttpClient.mapRequest(HttpClientRequest.prependUrl(`${agent.nodeRequestUrl}/configs`)),
            HttpClient.filterStatusOk
        );
        const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
        const ConfigClient = client.pipe(HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(Config)));
        const IdResponseClient = client.pipe(
            HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(IdResponse))
        );
        const ConfigsClient = client.pipe(
            HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(Schema.Array(Config)))
        );

        const list_ = (
            options?: ConfigListOptions | undefined
        ): Effect.Effect<ReadonlyArray<Config>, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.get(""),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                ConfigsClient,
                Effect.mapError((error) => new ConfigsError({ method: "list", error }))
            );

        const create_ = (options: ConfigSpec): Effect.Effect<Readonly<IdResponse>, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/create"),
                HttpClientRequest.schemaBody(ConfigSpec)(options),
                Effect.flatMap(IdResponseClient),
                Effect.mapError((error) => new ConfigsError({ method: "create", error }))
            );

        const delete_ = (options: ConfigDeleteOptions): Effect.Effect<void, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/${encodeURIComponent(options.id)}`),
                voidClient,
                Effect.mapError((error) => new ConfigsError({ method: "delete", error })),
                Effect.scoped
            );

        const inspect_ = (options: ConfigInspectOptions): Effect.Effect<Readonly<Config>, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/${encodeURIComponent(options.id)}`),
                ConfigClient,
                Effect.mapError((error) => new ConfigsError({ method: "inspect", error }))
            );

        const update_ = (options: ConfigUpdateOptions): Effect.Effect<void, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/${encodeURIComponent(options.id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBody(ConfigSpec)(options.spec),
                Effect.flatMap(voidClient),
                Effect.mapError((error) => new ConfigsError({ method: "update", error })),
                Effect.scoped
            );

        return {
            list: list_,
            create: create_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
        };
    }
);

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Configs {
    readonly _: unique symbol;
}

/**
 * Configs service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Configs: Context.Tag<Configs, ConfigsImpl> = Context.GenericTag<Configs, ConfigsImpl>(
    "@the-moby-effect/moby/Configs"
);

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Configs, never, IMobyConnectionAgent> = Layer.effect(Configs, make).pipe(
    Layer.provide(MobyHttpClientLive)
);

/**
 * Constructs a layer from an agent effect
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromAgent = (
    agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
): Layer.Layer<Configs, never, Scope.Scope> => layer.pipe(Layer.provide(Layer.effect(MobyConnectionAgent, agent)));

/**
 * Constructs a layer from agent connection options
 *
 * @since 1.0.0
 * @category Layers
 */
export const fromConnectionOptions = (
    connectionOptions: MobyConnectionOptions
): Layer.Layer<Configs, never, Scope.Scope> => fromAgent(getAgent(connectionOptions));
