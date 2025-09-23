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
import { Effect, Predicate, Schema, Stream, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    RegistryAuthenticateOKBody as AuthResponse,
    TypesDiskUsage as DiskUsage,
    RegistryAuthConfig,
    SystemInfo,
    TypesVersion as SystemVersion,
} from "../generated/index.js";
import { HttpApiStreamingResponse } from "./httpApiHacks.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SystemsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/SystemsError"
) as SystemsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type SystemsErrorTypeId = typeof SystemsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isSystemsError = (u: unknown): u is SystemsError => Predicate.hasProperty(u, SystemsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class SystemsError extends PlatformError.TypeIdError(SystemsErrorTypeId, "SystemsError")<{
    method: string;
    cause:
        | HttpApiError.InternalServerError
        | HttpApiError.BadRequest
        | HttpApiError.Unauthorized
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    get message() {
        return `${this.method}`;
    }

    static WrapForMethod(method: string) {
        return (cause: SystemsError["cause"]) => new this({ method, cause });
    }
}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemAuth */
const authEndpoint = HttpApiEndpoint.post("auth", "/auth")
    .setPayload(RegistryAuthConfig)
    .addSuccess(AuthResponse, { status: 200 }) // 200 OK
    .addSuccess(HttpApiSchema.NoContent) // 204 No Content
    .addError(HttpApiError.Unauthorized); // 401 Unauthorized

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemInfo */
const infoEndpoint = HttpApiEndpoint.get("info", "/info").addSuccess(SystemInfo, { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemVersion */
const versionEndpoint = HttpApiEndpoint.get("version", "/version").addSuccess(SystemVersion, { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemPing */
const pingEndpoint = HttpApiEndpoint.get("ping", "/_ping").addSuccess(HttpApiSchema.Empty(200));

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemPingHead */
const pingHeadEndpoint = HttpApiEndpoint.head("pingHead", "/_ping").addSuccess(HttpApiSchema.Empty(200));

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemEvents */
const eventsEndpoint = HttpApiEndpoint.get("events", "/events")
    .setUrlParams(
        Schema.Struct({
            since: Schema.optional(Schema.String),
            until: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.BadRequest); // 400 Bad request

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemDataUsage */
const dataUsageEndpoint = HttpApiEndpoint.get("dataUsage", "/system/df")
    .setUrlParams(
        Schema.Struct({
            type: Schema.optional(
                Schema.Array(
                    Schema.Union(
                        Schema.Literal("container"),
                        Schema.Literal("image"),
                        Schema.Literal("volume"),
                        Schema.Literal("build-cache")
                    )
                )
            ),
        })
    )
    .addSuccess(DiskUsage, { status: 200 }); // 200 OK

/** @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System */
const SystemGroup = HttpApiGroup.make("system")
    .add(authEndpoint)
    .add(infoEndpoint)
    .add(versionEndpoint)
    .add(pingEndpoint)
    .add(pingHeadEndpoint)
    .add(eventsEndpoint)
    .add(dataUsageEndpoint)
    .addError(HttpApiError.InternalServerError);

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System
 */
export const SystemApi = HttpApi.make("SystemApi").add(SystemGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System
 */
export class System extends Effect.Service<System>()("@the-moby-effect/endpoints/System", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof SystemGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof SystemGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(SystemApi, { group: "system", httpClient });

        const auth_ = (payload: RegistryAuthConfig) =>
            Effect.mapError(client.auth({ payload }), SystemsError.WrapForMethod("auth"));
        const info_ = () => Effect.mapError(client.info({}), SystemsError.WrapForMethod("info"));
        const version_ = () => Effect.mapError(client.version({}), SystemsError.WrapForMethod("version"));
        const ping_ = () => Effect.mapError(client.ping({}), SystemsError.WrapForMethod("ping"));
        const pingHead_ = () => Effect.mapError(client.pingHead({}), SystemsError.WrapForMethod("pingHead"));
        const events_ = (options?: Options<"events">) =>
            Stream.mapError(
                HttpApiStreamingResponse(SystemApi, "system", "events", httpClient)({ urlParams: { ...options } }),
                SystemsError.WrapForMethod("events")
            );
        const dataUsage_ = (params?: Options<"dataUsage">) =>
            Effect.mapError(client.dataUsage({ urlParams: { ...params } }), SystemsError.WrapForMethod("dataUsage"));

        return {
            auth: auth_,
            info: info_,
            version: version_,
            ping: ping_,
            pingHead: pingHead_,
            events: events_,
            dataUsage: dataUsage_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System
 */
export const SystemLayerLocalSocket: Layer.Layer<System, never, HttpClient.HttpClient> = System.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System
 */
export const SystemLayer: Layer.Layer<System, never, HttpClient.HttpClient> = System.DefaultWithoutDependencies;
