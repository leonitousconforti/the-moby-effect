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
    type Socket,
} from "@effect/platform";
import { Effect, Predicate, Schema, String, type Layer, type ParseResult } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import type { MultiplexedSocket, RawSocket } from "../../MobyDemux.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    ContainerExecStartOptions,
    ContainerExecOptions as ExecConfig,
    ContainerExecInspect as ExecInspectResponse,
} from "../generated/index.js";
import { ExecIdentifier } from "../schemas/id.js";
import { HttpApiSocket } from "./httpApiHacks.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const ExecsErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/ExecsError") as ExecsErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
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
        | Socket.SocketError
        | HttpApiError.InternalServerError
        | HttpApiError.Conflict
        | HttpApiError.BadRequest
        | HttpApiError.NotFound
        | ParseResult.ParseError
        | HttpClientError.HttpClientError
        | HttpApiError.HttpApiDecodeError;
}> {
    public override get message() {
        return `${String.capitalize(this.method)} ${this.cause._tag}`;
    }

    public static WrapForMethod(method: string) {
        return (cause: ExecsError["cause"]) => new this({ method, cause });
    }
}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ContainerExec */
const createExecEndpoint = HttpApiEndpoint.post("container", "/containers/:id/exec")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(ExecConfig)
    .addSuccess(Schema.Struct({ Id: ExecIdentifier }), { status: 201 })
    .addError(HttpApiError.NotFound) // 404 No such container
    .addError(HttpApiError.Conflict); // 409 Container is not running

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecStart */
const startExecEndpoint = HttpApiEndpoint.post("start", "/exec/:id/start")
    .setPath(Schema.Struct({ id: ExecIdentifier }))
    .setHeaders(Schema.Struct({ Upgrade: Schema.Literal("tcp"), Connection: Schema.Literal("Upgrade") }))
    .setPayload(ContainerExecStartOptions)
    .addSuccess(HttpApiSchema.Empty(101))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound) // 404 No such Exec instance
    .addError(HttpApiError.Conflict); // 409 Container is not running

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecResize */
const resizeExecEndpoint = HttpApiEndpoint.post("resize", "/exec/:id/resize")
    .setPath(Schema.Struct({ id: ExecIdentifier }))
    .setUrlParams(
        Schema.Struct({
            h: Schema.NumberFromString,
            w: Schema.NumberFromString,
        })
    )
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.BadRequest) // 400 Invalid parameters
    .addError(HttpApiError.NotFound); // 404 No such Exec instance

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecInspect */
const inspectExecEndpoint = HttpApiEndpoint.get("inspect", "/exec/:id/json")
    .setPath(Schema.Struct({ id: ExecIdentifier }))
    .addSuccess(ExecInspectResponse, { status: 200 })
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec */
const ExecsGroup = HttpApiGroup.make("exec")
    .add(createExecEndpoint)
    .add(startExecEndpoint)
    .add(resizeExecEndpoint)
    .add(inspectExecEndpoint)
    .addError(HttpApiError.InternalServerError);

/**
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */
export const ExecsApi = HttpApi.make("ExecsApi").add(ExecsGroup);

/**
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */
export class Execs extends Effect.Service<Execs>()("@the-moby-effect/endpoints/Execs", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const client = yield* HttpApiClient.group(ExecsApi, { group: "exec", httpClient });

        const container_ = (id: string, payload: ConstructorParameters<typeof ExecConfig>[0]) =>
            Effect.mapError(
                client.container({ path: { id }, payload: ExecConfig.make(payload) }),
                ExecsError.WrapForMethod("container")
            );
        const start_ = <const T extends boolean = false>(
            id: ExecIdentifier,
            payload: Omit<ConstructorParameters<typeof ContainerExecStartOptions>[0], "Detach"> & { Detach: T }
        ): Effect.Effect<[T] extends [false] ? RawSocket | MultiplexedSocket : void, ExecsError, never> =>
            HttpApiSocket(
                ExecsApi,
                "exec",
                "start",
                httpClient
            )({
                path: { id },
                payload: ContainerExecStartOptions.make(payload),
                headers: { Connection: "Upgrade", Upgrade: "tcp" },
            })
                .pipe(
                    Effect.map(
                        (socket) =>
                            (payload.Detach === true ? void 0 : socket) as [T] extends [false]
                                ? RawSocket | MultiplexedSocket
                                : void
                    )
                )
                .pipe(Effect.mapError(ExecsError.WrapForMethod("start")));
        const resize_ = (id: ExecIdentifier, params: { w: number; h: number }) =>
            Effect.mapError(
                client.resize({ path: { id }, urlParams: { ...params } }),
                ExecsError.WrapForMethod("resize")
            );
        const inspect_ = (id: ExecIdentifier) =>
            Effect.mapError(client.inspect({ path: { id } }), ExecsError.WrapForMethod("inspect"));

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
export const ExecsLayerLocalSocket: Layer.Layer<Execs, never, HttpClient.HttpClient> = Execs.Default;

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */
export const ExecsLayer: Layer.Layer<Execs, never, HttpClient.HttpClient> = Execs.DefaultWithoutDependencies;
