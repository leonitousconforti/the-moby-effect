/**
 * Execs service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Scope from "effect/Scope";

import { responseToStreamingSocketOrFail } from "../demux/Hijack.js";
import { MultiplexedStreamSocket } from "../demux/Multiplexed.js";
import { BidirectionalRawStreamSocket } from "../demux/Raw.js";
import {
    ContainerExecOptions as ContainerExecStartConfig,
    ContainerExecOptions as ExecConfig,
    ContainerExecInspect as ExecInspectResponse,
    IDResponse,
} from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ExecsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/ExecsError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type ExecsErrorTypeId = typeof ExecsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isDistributionsError = (u: unknown): u is ExecsError => Predicate.hasProperty(u, ExecsErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class ExecsError extends PlatformError.TypeIdError(ExecsErrorTypeId, "ExecsError")<{
    method: string;
    cause:
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpBody.HttpBodyError
        | Socket.SocketError
        | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * Execs service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Execs extends Effect.Service<Execs>()("@the-moby-effect/endpoints/Execs", {
    effect: Effect.gen(function* () {
        const contextClient = yield* HttpClient.HttpClient;
        const client = contextClient.pipe(HttpClient.filterStatusOk);

        /**
         * Create an exec instance
         *
         * @param execConfig - Exec configuration
         * @param id - ID or name of container
         */
        const container_ = (options: {
            readonly execConfig: Schema.Schema.Type<typeof ExecConfig>;
            readonly id: string;
        }): Effect.Effect<Readonly<IDResponse>, ExecsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/containers/${encodeURIComponent(options.id)}/exec`),
                HttpClientRequest.schemaBodyJson(ExecConfig)(Schema.decodeSync(ExecConfig)(options.execConfig)),
                Effect.flatMap(client.execute),
                Effect.flatMap(HttpClientResponse.schemaBodyJson(IDResponse)),
                Effect.mapError((cause) => new ExecsError({ method: "container", cause })),
                Effect.scoped
            );

        /**
         * Start an exec instance
         *
         * @param execStartConfig -
         * @param id - Exec instance ID
         */
        const start_ = <T extends boolean | undefined>(
            options: {
                readonly execStartConfig: Schema.Schema.Type<typeof ContainerExecStartConfig>;
                readonly id: string;
            } & {
                execStartConfig: Omit<Schema.Schema.Type<typeof ContainerExecStartConfig>, "Detach"> & { Detach?: T };
            }
        ): T extends true
            ? Effect.Effect<void, ExecsError, never>
            : Effect.Effect<MultiplexedStreamSocket | BidirectionalRawStreamSocket, ExecsError, Scope.Scope> => {
            type U = T extends true
                ? Effect.Effect<void, ExecsError, never>
                : Effect.Effect<MultiplexedStreamSocket | BidirectionalRawStreamSocket, ExecsError, Scope.Scope>;

            const response = Function.pipe(
                HttpClientRequest.post(`/exec/${encodeURIComponent(options.id)}/start`),
                HttpClientRequest.schemaBodyJson(ContainerExecStartConfig)(
                    Schema.decodeSync(ContainerExecStartConfig)(options.execStartConfig)
                ),
                Effect.flatMap(client.execute),
                Effect.mapError((cause) => new ExecsError({ method: "start", cause }))
            );

            const toStreamingSock = Function.compose(
                responseToStreamingSocketOrFail,
                Effect.mapError((cause) => new ExecsError({ method: "start", cause }))
            );

            return options.execStartConfig.Detach
                ? (Function.pipe(response, Effect.asVoid, Effect.scoped) as U)
                : (Function.pipe(response, Effect.flatMap(toStreamingSock)) as U);
        };

        /**
         * Resize an exec instance
         *
         * @param id - Exec instance ID
         * @param h - Height of the TTY session in characters
         * @param w - Width of the TTY session in characters
         */
        const resize_ = (options: {
            readonly id: string;
            readonly h?: number;
            readonly w?: number;
        }): Effect.Effect<void, ExecsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/exec/${encodeURIComponent(options.id)}/resize`),
                maybeAddQueryParameter("h", Option.fromNullable(options.h)),
                maybeAddQueryParameter("w", Option.fromNullable(options.w)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ExecsError({ method: "resize", cause })),
                Effect.scoped
            );

        const inspect_ = (options: { readonly id: string }): Effect.Effect<ExecInspectResponse, ExecsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/exec/${encodeURIComponent(options.id)}/json`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(ExecInspectResponse)),
                Effect.mapError((cause) => new ExecsError({ method: "inspect", cause })),
                Effect.scoped
            );

        return {
            container: container_,
            start: start_,
            resize: resize_,
            inspect: inspect_,
        };
    }),
}) {}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Execs, never, HttpClient.HttpClient> = Execs.Default;
