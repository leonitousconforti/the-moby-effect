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

import { responseToStreamingSocketOrFail } from "../demux/Common.js";
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
export const ExecsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/ExecsError");

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
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | HttpBody.HttpBodyError | Socket.SocketError;
}> {
    get message() {
        return this.method;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ContainerExecOptions {
    /** Exec configuration */
    readonly execConfig: Schema.Schema.Type<typeof ExecConfig>;
    /** ID or name of container */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ExecStartOptions {
    readonly execStartConfig: Schema.Schema.Type<typeof ContainerExecStartConfig>;
    /** Exec instance ID */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ExecResizeOptions {
    /** Exec instance ID */
    readonly id: string;
    /** Height of the TTY session in characters */
    readonly h?: number;
    /** Width of the TTY session in characters */
    readonly w?: number;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ExecInspectOptions {
    /** Exec instance ID */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export interface ExecsImpl {
    /**
     * Create an exec instance
     *
     * @param execConfig - Exec configuration
     * @param id - ID or name of container
     */
    readonly container: (options: ContainerExecOptions) => Effect.Effect<Readonly<IDResponse>, ExecsError, never>;

    /**
     * Start an exec instance
     *
     * @param execStartConfig -
     * @param id - Exec instance ID
     */
    readonly start: <T extends boolean | undefined>(
        options: ExecStartOptions & {
            execStartConfig: Omit<Schema.Schema.Type<typeof ContainerExecStartConfig>, "Detach"> & { Detach?: T };
        }
    ) => T extends true
        ? Effect.Effect<void, ExecsError, never>
        : Effect.Effect<MultiplexedStreamSocket | BidirectionalRawStreamSocket, ExecsError, Scope.Scope>;

    /**
     * Resize an exec instance
     *
     * @param id - Exec instance ID
     * @param h - Height of the TTY session in characters
     * @param w - Width of the TTY session in characters
     */
    readonly resize: (options: ExecResizeOptions) => Effect.Effect<void, ExecsError, never>;

    /**
     * Inspect an exec instance
     *
     * @param id - Exec instance ID
     */
    readonly inspect: (options: ExecInspectOptions) => Effect.Effect<ExecInspectResponse, ExecsError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<ExecsImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(HttpClient.filterStatusOk);
    const voidClient = client.pipe(HttpClient.transform(Effect.asVoid));
    const IdResponseClient = client.pipe(HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(IDResponse)));
    const ExecInspectResponseClient = client.pipe(
        HttpClient.mapEffect(HttpClientResponse.schemaBodyJson(ExecInspectResponse))
    );

    const container_ = (options: ContainerExecOptions): Effect.Effect<Readonly<IDResponse>, ExecsError, never> =>
        Function.pipe(
            HttpClientRequest.post("/containers/{id}/exec".replace("{id}", encodeURIComponent(options.id))),
            HttpClientRequest.schemaBody(ExecConfig)(Schema.decodeSync(ExecConfig)(options.execConfig)),
            Effect.flatMap(IdResponseClient),
            Effect.mapError((cause) => new ExecsError({ method: "container", cause })),
            Effect.scoped
        );

    const start_ = <T extends boolean | undefined>(
        options: ExecStartOptions & {
            execStartConfig: Omit<Schema.Schema.Type<typeof ContainerExecStartConfig>, "Detach"> & { Detach?: T };
        }
    ): T extends true
        ? Effect.Effect<void, ExecsError, never>
        : Effect.Effect<MultiplexedStreamSocket | BidirectionalRawStreamSocket, ExecsError, Scope.Scope> => {
        type U = T extends true
            ? Effect.Effect<void, ExecsError, never>
            : Effect.Effect<MultiplexedStreamSocket | BidirectionalRawStreamSocket, ExecsError, Scope.Scope>;

        const response = Function.pipe(
            HttpClientRequest.post("/exec/{id}/start".replace("{id}", encodeURIComponent(options.id))),
            HttpClientRequest.schemaBody(ContainerExecStartConfig)(
                Schema.decodeSync(ContainerExecStartConfig)(options.execStartConfig)
            ),
            Effect.flatMap(client),
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

    const resize_ = (options: ExecResizeOptions): Effect.Effect<void, ExecsError, never> =>
        Function.pipe(
            HttpClientRequest.post(`/exec/${encodeURIComponent(options.id)}/resize`),
            maybeAddQueryParameter("h", Option.fromNullable(options.h)),
            maybeAddQueryParameter("w", Option.fromNullable(options.w)),
            voidClient,
            Effect.mapError((cause) => new ExecsError({ method: "resize", cause })),
            Effect.scoped
        );

    const inspect_ = (options: ExecInspectOptions): Effect.Effect<ExecInspectResponse, ExecsError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/exec/${encodeURIComponent(options.id)}/json`),
            ExecInspectResponseClient,
            Effect.mapError((cause) => new ExecsError({ method: "inspect", cause })),
            Effect.scoped
        );

    return {
        container: container_,
        start: start_,
        resize: resize_,
        inspect: inspect_,
    };
});

/**
 * Execs service
 *
 * @since 1.0.0
 * @category Tags
 */
export class Execs extends Effect.Tag("@the-moby-effect/endpoints/Execs")<Execs, ExecsImpl>() {}

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Execs, never, HttpClient.HttpClient.Default> = Layer.effect(Execs, make);
