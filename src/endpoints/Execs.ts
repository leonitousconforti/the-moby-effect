/**
 * @since 1.0.0
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpBody from "@effect/platform/HttpBody";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Socket from "@effect/platform/Socket";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as ParseResult from "effect/ParseResult";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Tuple from "effect/Tuple";

import { responseToStreamingSocketOrFailUnsafe } from "../demux/Hijack.js";
import { MultiplexedStreamSocket } from "../demux/Multiplexed.js";
import { RawStreamSocket } from "../demux/Raw.js";
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
 * @internal
 */
export const ExecsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/ExecsError") as ExecsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 * @internal
 */
export type ExecsErrorTypeId = typeof ExecsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isExecsError = (u: unknown): u is ExecsError => Predicate.hasProperty(u, ExecsErrorTypeId);

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
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */
export class Execs extends Effect.Service<Execs>()("@the-moby-effect/endpoints/Execs", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const contextClient = yield* HttpClient.HttpClient;
        const client = contextClient.pipe(HttpClient.filterStatusOk);

        /**
         * Create an exec instance
         *
         * @param execConfig - Exec configuration
         * @param id - ID or name of container
         * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ContainerExec
         */
        const container_ = (
            id: string,
            execConfig: typeof ExecConfig.Encoded
        ): Effect.Effect<Readonly<IDResponse>, ExecsError, never> =>
            Function.pipe(
                Schema.decode(ExecConfig)(execConfig),
                Effect.map((body) =>
                    Tuple.make(HttpClientRequest.post(`/containers/${encodeURIComponent(id)}/exec`), body)
                ),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(ExecConfig))),
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
         * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecStart
         */
        const start_ = <T extends boolean | undefined>(
            id: string,
            execStartConfig: Omit<typeof ContainerExecStartConfig.Encoded, "Detach"> & {
                Detach?: T;
            }
        ): T extends true
            ? Effect.Effect<void, ExecsError, never>
            : Effect.Effect<MultiplexedStreamSocket | RawStreamSocket, ExecsError, Scope.Scope> => {
            type U = T extends true
                ? Effect.Effect<void, ExecsError, never>
                : Effect.Effect<MultiplexedStreamSocket | RawStreamSocket, ExecsError, Scope.Scope>;

            const response = Function.pipe(
                Schema.decode(ContainerExecStartConfig)(execStartConfig),
                Effect.map((body) => Tuple.make(HttpClientRequest.post(`/exec/${encodeURIComponent(id)}/start`), body)),
                Effect.flatMap(Function.tupled(HttpClientRequest.schemaBodyJson(ContainerExecStartConfig))),
                Effect.flatMap(client.execute),
                Effect.mapError((cause) => new ExecsError({ method: "start", cause }))
            );

            const toStreamingSock = Function.compose(
                responseToStreamingSocketOrFailUnsafe,
                Effect.mapError((cause) => new ExecsError({ method: "start", cause }))
            );

            return execStartConfig.Detach
                ? (Function.pipe(response, Effect.asVoid, Effect.scoped) as U)
                : (Function.pipe(response, Effect.flatMap(toStreamingSock)) as U);
        };

        /**
         * Resize an exec instance
         *
         * @param id - Exec instance ID
         * @param h - Height of the TTY session in characters
         * @param w - Width of the TTY session in characters
         * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecResize
         */
        const resize_ = (
            id: string,
            options?:
                | {
                      readonly h?: number;
                      readonly w?: number;
                  }
                | undefined
        ): Effect.Effect<void, ExecsError, never> =>
            Function.pipe(
                HttpClientRequest.post(`/exec/${encodeURIComponent(id)}/resize`),
                maybeAddQueryParameter("h", Option.fromNullable(options?.h)),
                maybeAddQueryParameter("w", Option.fromNullable(options?.w)),
                client.execute,
                Effect.asVoid,
                Effect.mapError((cause) => new ExecsError({ method: "resize", cause })),
                Effect.scoped
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecInspect */
        const inspect_ = (id: string): Effect.Effect<ExecInspectResponse, ExecsError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/exec/${encodeURIComponent(id)}/json`),
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
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */
export const ExecsLayer: Layer.Layer<Execs, never, HttpClient.HttpClient> = Execs.Default;
