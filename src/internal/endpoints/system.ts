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
import {
    RegistryAuthenticateOKBody as AuthResponse,
    TypesDiskUsage as DiskUsage,
    RegistryAuthConfig,
    SystemInfo,
    TypesVersion as SystemVersion,
} from "../generated/index.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, InternalServerError, Unauthorized } from "./errors.ts";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemAuth */
const authEndpoint = HttpApiEndpoint.post("auth", "/auth", {
    payload: RegistryAuthConfig,
    success: [
        AuthResponse, // 200 OK
        HttpApiSchema.Empty(204), // 204 No Content
    ],
    error: [
        Unauthorized, // 401 Unauthorized
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemInfo */
const infoEndpoint = HttpApiEndpoint.get("info", "/info", {
    success: SystemInfo, // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemVersion */
const versionEndpoint = HttpApiEndpoint.get("version", "/version", {
    success: SystemVersion, // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemPing */
const pingEndpoint = HttpApiEndpoint.get("ping", "/_ping", {
    success: Schema.Literal("OK").pipe(HttpApiSchema.asText({ contentType: "text/plain" })), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemPingHead */
const pingHeadEndpoint = HttpApiEndpoint.head("pingHead", "/_ping", {
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemEvents */
const eventsEndpoint = HttpApiEndpoint.get("events", "/events", {
    query: {
        since: Schema.optional(Schema.String),
        until: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        BadRequest, // 400 Bad request
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemDataUsage */
const dataUsageEndpoint = HttpApiEndpoint.get("dataUsage", "/system/df", {
    query: {
        type: Schema.optional(Schema.Array(Schema.Literals(["container", "image", "volume", "build-cache"]))),
    },
    success: DiskUsage, // 200 OK
    error: [InternalServerError],
});

/** @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System */
const SystemGroup = HttpApiGroup.make("system").add(
    authEndpoint,
    infoEndpoint,
    versionEndpoint,
    pingEndpoint,
    pingHeadEndpoint,
    eventsEndpoint,
    dataUsageEndpoint
);

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
export class System extends Context.Service<System>()("@the-moby-effect/endpoints/System", {
    make: Effect.gen(function* () {
        type SystemEndpoints = HttpApiGroup.Endpoints<typeof SystemGroup>;
        type Options<Name extends SystemEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            SystemEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* HttpClient.HttpClient;
        const SystemsError = DockerError.WrapForModule("system");
        const client = yield* HttpApiClient.group(SystemApi, { group: "system", httpClient });

        const auth_ = (payload: (typeof RegistryAuthConfig)["~type.make.in"]) =>
            Effect.mapError(client.auth({ payload: RegistryAuthConfig.make(payload) }), SystemsError("auth"));
        const info_ = () => Effect.mapError(client.info(), SystemsError("info"));
        const version_ = () => Effect.mapError(client.version(), SystemsError("version"));
        const ping_ = () => Effect.mapError(client.ping(), SystemsError("ping"));
        const pingHead_ = () => Effect.mapError(client.pingHead(), SystemsError("pingHead"));
        const events_ = (options?: Options<"events">) =>
            client.events({ query: { ...options } }).pipe(
                Stream.unwrap,
                Stream.decodeText(),
                Stream.splitLines,
                Stream.mapEffect((line) => Schema.decodeEffect(Schema.UnknownFromJsonString)(line)),
                Stream.mapError(SystemsError("events"))
            );
        const dataUsage_ = (params?: Options<"dataUsage">) =>
            Effect.mapError(client.dataUsage({ query: { ...params } }), SystemsError("dataUsage"));

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
export const SystemLayer: Layer.Layer<System, never, HttpClient.HttpClient> = Layer.effect(System, System.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#tag/System
 */
export const SystemLayerLocalSocket: Layer.Layer<System, never, HttpClient.HttpClient> = SystemLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
