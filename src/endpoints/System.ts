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
export const SystemsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/SystemsError");

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
        return `${this.method}`;
    }
}

/**
 * Systems service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Systems extends Effect.Service<Systems>()("@the-moby-effect/endpoints/System", {
    accessors: true,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        // https://github.com/moby/moby/blob/4ea464d1a763b77d0a82ba3c105108ff536da826/api/server/router/system/system_routes.go#L324-L339
        const auth_ = (options: RegistryAuthConfig): Effect.Effect<Readonly<AuthResponse>, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.post("/auth"),
                HttpClientRequest.schemaBodyJson(RegistryAuthConfig)(options),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(AuthResponse)),
                Effect.mapError((cause) => new SystemsError({ method: "auth", cause })),
                Effect.scoped
            );

        // https://github.com/moby/moby/blob/4ea464d1a763b77d0a82ba3c105108ff536da826/api/server/router/system/system_routes.go#L60-L110
        const info_ = (): Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/info"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SystemInfoResponse)),
                Effect.mapError((cause) => new SystemsError({ method: "info", cause })),
                Effect.scoped
            );

        // https://github.com/moby/moby/blob/4ea464d1a763b77d0a82ba3c105108ff536da826/api/server/router/system/system_routes.go#L112-L119
        const version_ = (): Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/version"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SystemVersionResponse)),
                Effect.mapError((cause) => new SystemsError({ method: "version", cause })),
                Effect.scoped
            );

        // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L31-L49
        const ping_ = (): Effect.Effect<"OK", SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/_ping"),
                client.execute,
                Effect.flatMap((response) => response.text),
                Effect.flatMap(Schema.decodeUnknown(Schema.Literal("OK"))),
                Effect.mapError((cause) => new SystemsError({ method: "ping", cause })),
                Effect.scoped
            );

        // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L31-L49
        const pingHead_ = (): Effect.Effect<void, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.head("/_ping"),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new SystemsError({ method: "pingHead", cause })),
                Effect.scoped
            );

        // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L225-L303
        const events_ = (
            options?:
                | {
                      readonly since?: string;
                      readonly until?: string;
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
                | undefined
        ): Stream.Stream<EventMessage, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/events"),
                maybeAddQueryParameter("since", Option.fromNullable(options?.since)),
                maybeAddQueryParameter("until", Option.fromNullable(options?.until)),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText("utf8"),
                Stream.map(String.linesIterator),
                Stream.flattenIterables,
                Stream.flatMap(Schema.decode(Schema.parseJson(EventMessage))),
                Stream.mapError((cause) => new SystemsError({ method: "events", cause }))
            );

        // https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/server/router/system/system_routes.go#L117-L213
        const dataUsage_ = (
            options?:
                | { readonly type?: Array<"container" | "image" | "volume" | "build-cache"> | undefined }
                | undefined
        ): Effect.Effect<DiskUsage, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/system/df"),
                maybeAddQueryParameter("type", Option.fromNullable(options?.type)),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(DiskUsage)),
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
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Systems, never, HttpClient.HttpClient> = Systems.Default;
