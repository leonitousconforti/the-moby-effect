/**
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as Tuple from "effect/Tuple";

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
 * @internal
 */
export const SystemsErrorTypeId: unique symbol = Symbol.for(
    "@the-moby-effect/endpoints/SystemsError"
) as SystemsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 * @internal
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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
 */
export class Systems extends Effect.Service<Systems>()("@the-moby-effect/endpoints/System", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemAuth */
        const auth_ = (
            authConfig: typeof RegistryAuthConfig.Encoded
        ): Effect.Effect<Readonly<AuthResponse>, SystemsError, never> =>
            Function.pipe(
                Schema.decode(RegistryAuthConfig)(authConfig),
                Effect.map((body) => Tuple.make(HttpClientRequest.post("/auth"), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(RegistryAuthConfig))),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(AuthResponse)),
                Effect.mapError((cause) => new SystemsError({ method: "auth", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemInfo */
        const info_ = (): Effect.Effect<Readonly<SystemInfoResponse>, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/info"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SystemInfoResponse)),
                Effect.mapError((cause) => new SystemsError({ method: "info", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemVersion */
        const version_ = (): Effect.Effect<Readonly<SystemVersionResponse>, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/version"),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SystemVersionResponse)),
                Effect.mapError((cause) => new SystemsError({ method: "version", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemPing */
        const ping_ = (): Effect.Effect<"OK", SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.get("/_ping"),
                client.execute,
                Effect.flatMap((response) => response.text),
                Effect.flatMap(Schema.decodeUnknown(Schema.Literal("OK"))),
                Effect.mapError((cause) => new SystemsError({ method: "ping", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemPingHead */
        const pingHead_ = (): Effect.Effect<void, SystemsError, never> =>
            Function.pipe(
                HttpClientRequest.head("/_ping"),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new SystemsError({ method: "pingHead", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemEvents */
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
                Stream.decodeText(),
                Stream.splitLines,
                Stream.flatMap(Schema.decode(Schema.parseJson(EventMessage))),
                Stream.mapError((cause) => new SystemsError({ method: "events", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/System/operation/SystemDataUsage */
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
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/System
 */
export const SystemsLayer: Layer.Layer<Systems, never, HttpClient.HttpClient> = Systems.Default;
