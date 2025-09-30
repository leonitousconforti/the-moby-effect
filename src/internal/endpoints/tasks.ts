import { HttpApi, HttpApiClient, HttpApiEndpoint, HttpApiGroup, HttpApiSchema, HttpClient } from "@effect/platform";
import { Effect, Schema, Stream, type Layer } from "effect";

import { MobyConnectionOptions } from "../../MobyConnection.js";
import { makeAgnosticHttpClientLayer } from "../../MobyPlatforms.js";
import { SwarmTask } from "../generated/index.js";
import { DockerError } from "./circular.ts";
import { HttpApiStreamingResponse, InternalServerError, NotFound } from "./httpApiHacks.js";
import { NodeNotPartOfSwarm } from "./swarm.js";

/** @since 1.0.0 */
export class TaskListFilters extends Schema.parseJson(
    Schema.Struct({
        "desired-state": Schema.optional(Schema.Array(Schema.Literal("running", "shutdown", "accepted"))),
        id: Schema.optional(Schema.Array(Schema.String)),
        name: Schema.optional(Schema.Array(Schema.String)),
        node: Schema.optional(Schema.Array(Schema.String)),
        service: Schema.optional(Schema.Array(Schema.String)),
        label: Schema.optional(Schema.Array(Schema.String)),
    })
) {}

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskList */
const listTasksEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(TaskListFilters) }))
    .addSuccess(Schema.Array(SwarmTask), { status: 200 }) // 200 OK
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskInspect */
const inspectTaskEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(SwarmTask, { status: 200 }) // 200 OK
    .addError(NotFound) // 404 No such task
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskLogs */
const logsTaskEndpoint = HttpApiEndpoint.get("logs", "/:id/logs")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(
        Schema.Struct({
            details: Schema.optional(Schema.BooleanFromString),
            follow: Schema.optional(Schema.BooleanFromString),
            stdout: Schema.optional(Schema.BooleanFromString),
            stderr: Schema.optional(Schema.BooleanFromString),
            since: Schema.optional(Schema.NumberFromString),
            timestamps: Schema.optional(Schema.BooleanFromString),
            tail: Schema.optional(Schema.String),
        })
    )
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(NotFound) // 404 No such task
    .addError(NodeNotPartOfSwarm); // 503 Node is not part of a swarm

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task */
const TasksGroup = HttpApiGroup.make("tasks")
    .add(listTasksEndpoint)
    .add(inspectTaskEndpoint)
    .add(logsTaskEndpoint)
    .addError(InternalServerError)
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
export class Tasks extends Effect.Service<Tasks>()("@the-moby-effect/endpoints/Tasks", {
    accessors: false,
    dependencies: [
        makeAgnosticHttpClientLayer(
            MobyConnectionOptions.socket({
                socketPath: "/var/run/docker.sock",
            })
        ),
    ],

    effect: Effect.gen(function* () {
        type Options<Name extends (typeof TasksGroup.endpoints)[number]["name"]> =
            HttpApiEndpoint.HttpApiEndpoint.UrlParams<
                HttpApiEndpoint.HttpApiEndpoint.WithName<(typeof TasksGroup.endpoints)[number], Name>
            >;

        const httpClient = yield* HttpClient.HttpClient;
        const TasksError = DockerError.WrapForModule("tasks");
        const client = yield* HttpApiClient.group(TasksApi, { group: "tasks", httpClient });

        const list_ = (filters?: Schema.Schema.Type<TaskListFilters>) =>
            Effect.mapError(client.list({ urlParams: { filters } }), TasksError("list"));
        const inspect_ = (id: string) => Effect.mapError(client.inspect({ path: { id } }), TasksError("inspect"));
        const logs_ = (id: string, options?: Options<"logs">) =>
            HttpApiStreamingResponse(
                TasksApi,
                "tasks",
                "logs",
                httpClient
            )({ path: { id }, urlParams: { ...options } })
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
export const TasksLayer: Layer.Layer<Tasks, never, HttpClient.HttpClient> = Tasks.DefaultWithoutDependencies;

/**
 * A task is a container running on a swarm. It is the atomic scheduling unit of
 * swarm. Swarm mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Layers
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
 */
export const TasksLayerLocalSocket: Layer.Layer<Tasks, never, HttpClient.HttpClient> = Tasks.Default;
