import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpApi from "effect/unstable/httpapi/HttpApi";
import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient";
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup";
import * as HttpApiSchema from "effect/unstable/httpapi/HttpApiSchema";

import type { MultiplexedSocket, RawSocket } from "../../MobyDemux.ts";

import { MobyConnectionOptions } from "../../MobyConnection.ts";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.ts";
import { responseToStreamingSocketOrFailUnsafe } from "../demux/hijack.ts";
import {
    ContainerExecStartOptions,
    ContainerExecOptions as ExecConfig,
    ContainerExecInspect as ExecInspectResponse,
} from "../generated/index.ts";
import { ExecIdentifier } from "../schemas/id.ts";
import { DockerError } from "./circular.ts";
import { BadRequest, Conflict, InternalServerError, NotFound } from "./errors.ts";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ContainerExec */
const createExecEndpoint = HttpApiEndpoint.post("container", "/containers/:id/exec", {
    params: { id: Schema.String },
    payload: ExecConfig,
    success: Schema.Struct({ Id: ExecIdentifier }).pipe(HttpApiSchema.status(201)), // 201 Created
    error: [
        NotFound, // 404 No such container
        Conflict, // 409 Container is not running
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecStart */
const startExecEndpoint = HttpApiEndpoint.post("start", "/exec/:id/start", {
    params: { id: ExecIdentifier },
    headers: {
        Upgrade: Schema.Literal("tcp"),
        Connection: Schema.Literal("Upgrade"),
    },
    payload: ContainerExecStartOptions,
    success: [
        HttpApiSchema.Empty(101), // 101 Switching Protocols
        HttpApiSchema.Empty(200), // 200 OK
    ],
    error: [
        NotFound, // 404 No such Exec instance
        Conflict, // 409 Container is not running
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecResize */
const resizeExecEndpoint = HttpApiEndpoint.post("resize", "/exec/:id/resize", {
    params: { id: ExecIdentifier },
    query: {
        h: Schema.Number,
        w: Schema.Number,
    },
    success: HttpApiSchema.Empty(200), // 200 OK
    error: [
        BadRequest, // 400 Invalid parameters
        NotFound, // 404 No such Exec instance
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecInspect */
const inspectExecEndpoint = HttpApiEndpoint.get("inspect", "/exec/:id/json", {
    params: { id: ExecIdentifier },
    success: ExecInspectResponse, // 200 OK
    error: [
        NotFound, // 404 No such Exec instance
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec */
const ExecsGroup = HttpApiGroup.make("exec").add(
    createExecEndpoint,
    startExecEndpoint,
    resizeExecEndpoint,
    inspectExecEndpoint
);

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
export class Execs extends Context.Service<Execs>()("@the-moby-effect/endpoints/Execs", {
    make: Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient;
        const ExecsError = DockerError.WrapForModule("execs");
        const client = yield* HttpApiClient.group(ExecsApi, { group: "exec", httpClient });

        const container_ = (id: string, payload: (typeof ExecConfig)["~type.make.in"]) =>
            Effect.mapError(
                client.container({ params: { id }, payload: new ExecConfig(payload) }),
                ExecsError("container")
            );
        const start_ = <const T extends boolean = false>(
            id: ExecIdentifier,
            payload: Omit<(typeof ContainerExecStartOptions)["~type.make.in"], "Detach"> & {
                Detach: T;
            }
        ): Effect.Effect<[T] extends [false] ? RawSocket | MultiplexedSocket : void, DockerError, never> =>
            client
                .start({
                    params: { id },
                    payload: new ContainerExecStartOptions(payload),
                    headers: { Connection: "Upgrade", Upgrade: "tcp" }, // FIXME: Broken on undici
                    responseMode: "response-only",
                })
                .pipe(
                    Effect.flatMap(responseToStreamingSocketOrFailUnsafe),
                    Effect.map(
                        (socket) =>
                            (payload.Detach === true ? void 0 : socket) as [T] extends [false]
                                ? RawSocket | MultiplexedSocket
                                : void
                    ),
                    Effect.mapError(ExecsError("start"))
                );
        const resize_ = (id: ExecIdentifier, params: { w: number; h: number }) =>
            Effect.mapError(client.resize({ params: { id }, query: { ...params } }), ExecsError("resize"));
        const inspect_ = (id: ExecIdentifier) =>
            Effect.mapError(client.inspect({ params: { id } }), ExecsError("inspect"));

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
export const ExecsLayer: Layer.Layer<Execs, never, HttpClient.HttpClient> = Layer.effect(Execs, Execs.make);

/**
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec
 */
export const ExecsLayerLocalSocket: Layer.Layer<Execs, never, HttpClient.HttpClient> = ExecsLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
