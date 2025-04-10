import type * as HttpBody from "@effect/platform/HttpBody";
import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Layer from "effect/Layer";
import type * as ParseResult from "effect/ParseResult";

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Tuple from "effect/Tuple";

import { SwarmConfig, SwarmConfigCreateResponse, SwarmConfigSpec } from "../generated/index.js";
import { maybeAddFilters, maybeAddQueryParameter } from "./common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ConfigsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/ConfigsError"
) as ConfigsErrorTypeId;

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export class Configs extends Effect.Service<Configs>()("@the-moby-effect/endpoints/Configs", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const contextClient = yield* HttpClient.HttpClient;
        const client = contextClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigList */
        const list_ = (
            options?:
                | {
                      readonly filters?: {
                          id?: string | undefined;
                          label?: Record<string, string> | undefined;
                          name?: string | undefined;
                          names?: string | undefined;
                      };
                  }
                | undefined
        ): Effect.Effect<ReadonlyArray<SwarmConfig>, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/configs"),
                maybeAddFilters(options?.filters),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmConfig))),
                Effect.mapError((cause) => new ConfigsError({ method: "list", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigCreate */
        const create_ = (
            options: typeof SwarmConfigSpec.Encoded
        ): Effect.Effect<Readonly<SwarmConfigCreateResponse>, ConfigsError, never> =>
            Function.pipe(
                Schema.decode(SwarmConfigSpec)(options),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/configs/create"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(SwarmConfigSpec))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmConfigCreateResponse)),
                Effect.mapError((cause) => new ConfigsError({ method: "create", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigDelete */
        const delete_ = (id: string): Effect.Effect<void, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.del(`/configs/${encodeURIComponent(id)}`),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ConfigsError({ method: "delete", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigInspect */
        const inspect_ = (id: string): Effect.Effect<Readonly<SwarmConfig>, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/configs/${encodeURIComponent(id)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmConfig)),
                Effect.mapError((cause) => new ConfigsError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Config/operation/ConfigUpdate */
        const update_ = (
            id: string,
            options: {
                /**
                 * The spec of the config to update. Currently, only the Labels
                 * field can be updated. All other fields must remain unchanged
                 * from the ConfigInspect response values.
                 */
                readonly spec: SwarmConfigSpec;
                /**
                 * The version number of the config object being updated. This
                 * is required to avoid conflicting writes.
                 */
                readonly version: number;
            }
        ): Effect.Effect<void, ConfigsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/configs/${encodeURIComponent(id)}/update`),
                maybeAddQueryParameter("version", Option.some(options.version)),
                HttpClientRequest.schemaBodyJson(SwarmConfigSpec)(options.spec),
                Effect.flatMap(client.execute),
                Effect.asVoid,
                Effect.mapError((cause) => new ConfigsError({ method: "update", cause }))
            );

        return {
            list: list_,
            create: create_,
            delete: delete_,
            inspect: inspect_,
            update: update_,
        };
    }),
}) {}

/**
 * Configs are application configurations that can be used by services. Swarm
 * mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Config
 */
export const ConfigsLayer: Layer.Layer<Configs, never, HttpClient.HttpClient> = Configs.Default;
