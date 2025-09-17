import {
    HttpApi,
    HttpApiClient,
    HttpApiEndpoint,
    HttpApiError,
    HttpApiGroup,
    HttpApiSchema,
    HttpClient,
} from "@effect/platform";
import { Effect, Schema, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import {
    ContainerExecOptions as ContainerExecStartConfig,
    ContainerExecOptions as ExecConfig,
    ContainerExecInspect as ExecInspectResponse,
} from "../generated/index.js";
import { ExecId } from "../schemas/id.js";
import { HttpApiSocket } from "./httpApiHacks.js";

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ContainerExec */
const createExecEndpoint = HttpApiEndpoint.post("container", "/containers/:id/exec")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setPayload(ExecConfig)
    .addSuccess(Schema.Struct({ Id: ExecId }), { status: 201 })
    .addError(HttpApiError.NotFound) // 404 No such container
    .addError(HttpApiError.Conflict); // 409 Container is not running

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecStart */
const startExecEndpoint = HttpApiEndpoint.post("start", "/exec/:id/start")
    .setPath(Schema.Struct({ id: ExecId }))
    .setHeaders(Schema.Struct({ Upgrade: Schema.Literal("tcp"), Connection: Schema.Literal("Upgrade") }))
    .setPayload(ContainerExecStartConfig)
    .addSuccess(HttpApiSchema.Empty(101))
    .addSuccess(HttpApiSchema.Empty(200))
    .addError(HttpApiError.NotFound) // 404 No such Exec instance
    .addError(HttpApiError.Conflict); // 409 Container is not running

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Exec/operation/ExecResize */
const resizeExecEndpoint = HttpApiEndpoint.post("resize", "/exec/:id/resize")
    .setPath(Schema.Struct({ id: ExecId }))
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
    .setPath(Schema.Struct({ id: ExecId }))
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

        const container_ = (id: string, payload: ExecConfig) => client.container({ path: { id }, payload });
        const start_ = (id: ExecId, payload: ContainerExecStartConfig) =>
            HttpApiSocket(
                ExecsApi,
                "exec",
                "start",
                httpClient
            )({
                payload,
                path: { id },
                headers: { Connection: "Upgrade", Upgrade: "tcp" },
            });
        const resize_ = (id: ExecId, params: { w: number; h: number }) =>
            client.resize({ path: { id }, urlParams: { ...params } });
        const inspect_ = (id: ExecId) => client.inspect({ path: { id } });

        return { container: container_, start: start_, resize: resize_, inspect: inspect_ };
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
