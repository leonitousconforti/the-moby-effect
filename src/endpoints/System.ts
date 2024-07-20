/**
 * Systems service
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
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";
import * as String from "effect/String";

import {
    RegistryAuthenticateOKBody as AuthResponse,
    DiskUsage,
    EventMessage,
    RegistryAuthConfig,
    SystemInfoResponse,
    SystemVersionResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const SystemsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/SystemsError");

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError;
}> {
    get message() {
        return this.method;
    }
}

/** @since 1.0.0 */
export interface SystemEventsOptions {
    /** Show events created since this timestamp then stream new events. */
    readonly since?: string;
    /** Show events created until this timestamp then stop streaming. */
    readonly until?: string;
    /**
     * A JSON encoded value of filters (a `map[string][]string`) to process on
     * the event list. Available filters:
     *
     * - `config=<string>` config name or ID
     * - `container=<string>` container name or ID
     * - `daemon=<string>` daemon name or ID
     * - `event=<string>` event type
     * - `image=<string>` image name or ID
     * - `label=<string>` image or container label
     * - `network=<string>` network name or ID
     * - `node=<string>` node ID
     * - `plugin`=<string> plugin name or ID
     * - `scope`=<string> local or swarm
     * - `secret=<string>` secret name or ID
     * - `service=<string>` service name or ID
     * - `type=<string>` object to filter by, one of `container`, `image`,
     *   `volume`, `network`, `daemon`, `plugin`, `node`, `service`, `secret` or
     *   `config`
     * - `volume=<string>` volume name
     */
    readonly filters?: {
        config?: string | undefined;
        container?: string | undefined;
        daemon?: string | undefined;
        event?: string | undefined;
        image?: string | undefined;
        label?: string | undefined;
        network?: string | undefined;
        node?: string | undefined;
        plugin?: string | undefined;
        scope?: string | undefined;
        secret?: string | undefined;
        service?: string | undefined;
        type?: string | undefined;
        volume?: string | undefined;
    };
}

/** @since 1.0.0 */
export interface SystemDataUsageOptions {
    /** Object types, for which to compute and return data. */
    readonly type?: Array<"container" | "image" | "volume" | "build-cache"> | undefined;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface SystemsImpl {
    /**
     * Check auth configuration
     *
     * @param authConfig - Authentication to check
     */
    readonly auth: (
        options: Schema.Schema.Encoded<typeof RegistryAuthConfig>
    ) => Effect.Effect<AuthResponse, SystemsError, never>;

    /** Get system information */
    readonly info: () => Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, never>;

    /** Get version */
    readonly version: () => Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, never>;

    /** Ping */
    readonly ping: () => Effect.Effect<"OK", SystemsError, never>;

    /** Ping */
    readonly pingHead: () => Effect.Effect<void, SystemsError, never>;

    /**
     * Monitor events
     *
     * @param since - Show events created since this timestamp then stream new
     *   events.
     * @param until - Show events created until this timestamp then stop
     *   streaming.
     * @param filters - A JSON encoded value of filters (a
     *   `map[string][]string`) to process on the event list. Available
     *   filters:
     *
     *   - `config=<string>` config name or ID
     *   - `container=<string>` container name or ID
     *   - `daemon=<string>` daemon name or ID
     *   - `event=<string>` event type
     *   - `image=<string>` image name or ID
     *   - `label=<string>` image or container label
     *   - `network=<string>` network name or ID
     *   - `node=<string>` node ID
     *   - `plugin`=<string> plugin name or ID
     *   - `scope`=<string> local or swarm
     *   - `secret=<string>` secret name or ID
     *   - `service=<string>` service name or ID
     *   - `type=<string>` object to filter by, one of `container`, `image`,
     *       `volume`, `network`, `daemon`, `plugin`, `node`, `service`,
     *       `secret` or `config`
     *   - `volume=<string>` volume name
     */
    readonly events: (options?: SystemEventsOptions | undefined) => Stream.Stream<EventMessage, SystemsError, never>;

    /**
     * Get data usage information
     *
     * @param type - Object types, for which to compute and return data.
     */
    readonly dataUsage: (options?: SystemDataUsageOptions | undefined) => Effect.Effect<DiskUsage, SystemsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<SystemsImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(HttpClient.filterStatusOk);
    const SystemInfoClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SystemInfoResponse)));
    const SystemAuthResponseClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(AuthResponse)));
    const SystemVersionClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(SystemVersionResponse))
    );
    const SystemDataUsageResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(DiskUsage))
    );

    // https://github.com/moby/moby/blob/4ea464d1a763b77d0a82ba3c105108ff536da826/api/server/router/system/system_routes.go#L324-L339
    const auth_ = (options: RegistryAuthConfig): Effect.Effect<Readonly<AuthResponse>, SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/auth"),
            HttpClientRequest.schemaBody(RegistryAuthConfig)(options),
            Effect.flatMap(SystemAuthResponseClient),
            Effect.mapError((cause) => new SystemsError({ method: "auth", cause })),
            Effect.scoped
        );

    // https://github.com/moby/moby/blob/4ea464d1a763b77d0a82ba3c105108ff536da826/api/server/router/system/system_routes.go#L60-L110
    const info_ = (): Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/info"),
            SystemInfoClient,
            Effect.mapError((cause) => new SystemsError({ method: "info", cause })),
            Effect.scoped
        );

    // https://github.com/moby/moby/blob/4ea464d1a763b77d0a82ba3c105108ff536da826/api/server/router/system/system_routes.go#L112-L119
    const version_ = (): Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/version"),
            SystemVersionClient,
            Effect.mapError((cause) => new SystemsError({ method: "version", cause })),
            Effect.scoped
        );

    // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L31-L49
    const ping_ = (): Effect.Effect<"OK", SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/_ping"),
            client,
            HttpClientResponse.text,
            Effect.flatMap(Schema.decodeUnknown(Schema.Literal("OK"))),
            Effect.mapError((cause) => new SystemsError({ method: "ping", cause }))
        );

    // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L31-L49
    const pingHead_ = (): Effect.Effect<"OK", SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.head("/_ping"),
            client,
            HttpClientResponse.text,
            Effect.flatMap(Schema.decodeUnknown(Schema.Literal("OK"))),
            Effect.mapError((cause) => new SystemsError({ method: "pingHead", cause }))
        );

    // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L225-L303
    const events_ = (options?: SystemEventsOptions | undefined): Stream.Stream<EventMessage, SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/events"),
            maybeAddQueryParameter("since", Option.fromNullable(options?.since)),
            maybeAddQueryParameter("until", Option.fromNullable(options?.until)),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.map(String.linesIterator),
            Stream.flattenIterables,
            Stream.flatMap(Schema.decode(Schema.parseJson(EventMessage))),
            Stream.mapError((cause) => new SystemsError({ method: "events", cause }))
        );

    // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L117-L213
    const dataUsage_ = (options?: SystemDataUsageOptions | undefined): Effect.Effect<DiskUsage, SystemsError, never> =>
        Function.pipe(
            HttpClientRequest.get("/system/df"),
            maybeAddQueryParameter("type", Option.fromNullable(options?.type)),
            SystemDataUsageResponseClient,
            Effect.mapError((cause) => new SystemsError({ method: "dataUsage", cause })),
            Effect.scoped
        );

    return {
        auth: auth_,
        info: info_,
        version: version_,
        ping: ping_,
        pingHead: pingHead_,
        events: events_,
        dataUsage: dataUsage_,
    };
});

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Systems {
    readonly _: unique symbol;
}

/**
 * Systems service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Systems: Context.Tag<Systems, SystemsImpl> = Context.GenericTag<Systems, SystemsImpl>(
    "@the-moby-effect/moby/Systems"
);

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Systems, never, HttpClient.HttpClient.Default> = Layer.effect(Systems, make);
