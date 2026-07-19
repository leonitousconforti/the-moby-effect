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

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmTask } from "../generated/index.js";
import { DockerError } from "./circular.ts";
import { InternalServerError, NotFound, ServiceUnavailable } from "./errors.ts";
import { HttpApiStreamingResponse } from "./httpApiHacks.js";

/** @since 1.0.0 */
export const TaskListFilters = Schema.fromJsonString(
    Schema.Struct({
        "desired-state": Schema.optional(Schema.Array(Schema.Literals(["running", "shutdown", "accepted"]))),
        id: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.Array(Schema.String)),
        node: Schema.optional(Schema.Array(Schema.String)),
        service: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
    })
);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskList */
const listTasksEndpoint = HttpApiEndpoint.get("list", "/", {
    query: { filters: Schema.optional(TaskListFilters) },
    success: Schema.Array(SwarmTask), // 200 OK
    error: [
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskInspect */
const inspectTaskEndpoint = HttpApiEndpoint.get("inspect", "/:id", {
    params: { id: Schema.String },
    success: SwarmTask, // 200 OK
    error: [
        NotFound, // 404 No such task
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskLogs */
const logsTaskEndpoint = HttpApiEndpoint.get("logs", "/:id/logs", {
    params: { id: Schema.String },
    query: {
        details: Schema.optional(Schema.Boolean),
        follow: Schema.optional(Schema.Boolean),
        stdout: Schema.optional(Schema.Boolean),
        stderr: Schema.optional(Schema.Boolean),
        since: Schema.optional(Schema.Number),
        timestamps: Schema.optional(Schema.Boolean),
        tail: Schema.optional(Schema.String),
    },
    success: HttpApiSchema.StreamUint8Array(), // 200 OK (streaming response)
    error: [
        NotFound, // 404 No such task
        ServiceUnavailable, // 503 Node is not part of a swarm
        InternalServerError,
    ],
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task */
const TasksGroup = HttpApiGroup.make("tasks")
    .add(listTasksEndpoint, inspectTaskEndpoint, logsTaskEndpoint)
    .prefix("/tasks");

/**
 * A task is a container running on a swarm. It is the atomic scheduling unit of
 * swarm. Swarm mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category HttpApi
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
 */
export const TasksApi = HttpApi.make("TasksApi").add(TasksGroup);

/**
 * A task is a container running on a swarm. It is the atomic scheduling unit of
 * swarm. Swarm mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Services
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
 */
export class Tasks extends Context.Service<Tasks>()("@the-moby-effect/endpoints/Tasks", {
    make: Effect.gen(function* () {
        type TasksEndpoints = HttpApiGroup.Endpoints<typeof TasksGroup>;
        type Options<Name extends TasksEndpoints["identifier"]> = HttpApiEndpoint.WithIdentifier<
            TasksEndpoints,
            Name
        >["~Query"]["Type"];

        const httpClient = yield* HttpClient.HttpClient;
        const TasksError = DockerError.WrapForModule("tasks");
        const client = yield* HttpApiClient.group(TasksApi, { group: "tasks", httpClient });

        const list_ = (filters?: Schema.Schema.Type<typeof TaskListFilters>) =>
            Effect.mapError(client.list({ query: { filters } }), TasksError("list"));
        const inspect_ = (id: string) => Effect.mapError(client.inspect({ params: { id } }), TasksError("inspect"));
        const logs_ = (id: string, options?: Options<"logs">) =>
            HttpApiStreamingResponse(
                TasksApi,
                "tasks",
                "logs",
                httpClient
            )({ params: { id }, query: { ...options } })
                .pipe(Stream.decodeText())
                .pipe(Stream.splitLines)
                .pipe(Stream.mapError(TasksError("logs")));

        return {
            list: list_,
            inspect: inspect_,
            logs: logs_,
        };
    }),
}) {}

/**
 * A task is a container running on a swarm. It is the atomic scheduling unit of
 * swarm. Swarm mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
 */
export const TasksLayer: Layer.Layer<Tasks, never, HttpClient.HttpClient> = Layer.effect(Tasks, Tasks.make);

/**
 * A task is a container running on a swarm. It is the atomic scheduling unit of
 * swarm. Swarm mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
 */
export const TasksLayerLocalSocket: Layer.Layer<Tasks, never, HttpClient.HttpClient> = TasksLayer.pipe(
    Layer.provide(
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        )
    )
);
