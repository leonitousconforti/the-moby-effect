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
import { SwarmTask } from "../generated/index.js";

/**
 * Task list filters (JSON encoded)
 *
 * @since 1.0.0
 */
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

/**
 * Task logs query params
 *
 * @since 1.0.0
 */
export const TaskLogsQuery = Schema.Struct({
    details: Schema.optional(Schema.BooleanFromString),
    follow: Schema.optional(Schema.BooleanFromString),
    stdout: Schema.optional(Schema.BooleanFromString),
    stderr: Schema.optional(Schema.BooleanFromString),
    since: Schema.optional(Schema.NumberFromString),
    timestamps: Schema.optional(Schema.BooleanFromString),
    tail: Schema.optional(Schema.String),
});

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskList */
const listTasksEndpoint = HttpApiEndpoint.get("list", "/")
    .setUrlParams(Schema.Struct({ filters: Schema.optional(TaskListFilters) }))
    .addSuccess(Schema.Array(SwarmTask), { status: 200 });

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskInspect */
const inspectTaskEndpoint = HttpApiEndpoint.get("inspect", "/:id")
    .setPath(Schema.Struct({ id: Schema.String }))
    .addSuccess(SwarmTask, { status: 200 })
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskLogs */
const logsTaskEndpoint = HttpApiEndpoint.get("logs", "/:id/logs")
    .setPath(Schema.Struct({ id: Schema.String }))
    .setUrlParams(TaskLogsQuery)
    // Logs are multiplexed; represent as empty streaming body similar to containers implementation
    .addSuccess(HttpApiSchema.Empty(200)) // 200 OK
    .addError(HttpApiError.NotFound);

/** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task */
const TasksGroup = HttpApiGroup.make("tasks")
    .add(listTasksEndpoint)
    .add(inspectTaskEndpoint)
    .add(logsTaskEndpoint)
    .addError(HttpApiError.InternalServerError)
    .prefix("/tasks");

/**
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
export class TasksService extends Effect.Service<TasksService>()("@the-moby-effect/endpoints/Tasks", {
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
        const client = yield* HttpApiClient.group(TasksApi, { group: "tasks", httpClient });

        const list_ = (filters?: Schema.Schema.Type<TaskListFilters> | undefined) =>
            client.list({ urlParams: { filters } });
        const inspect_ = (id: string) => client.inspect({ path: { id } });

        // Logs: produce a Stream<string>. The Text schema returns a string body; wrap in singleton stream when not following.
        const logs_ = (id: string, query?: Schema.Schema.Type<typeof TaskLogsQuery>) =>
            client.logs({ path: { id }, urlParams: query ?? {} });

        return {
            list: list_,
            inspect: inspect_,
            logs: logs_,
        } as const;
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
export const TasksLayer: Layer.Layer<TasksService, never, HttpClient.HttpClient> =
    TasksService.DefaultWithoutDependencies as Layer.Layer<TasksService, never, HttpClient.HttpClient>;

/**
 * Local socket auto-configured layer
 *
 * @since 1.0.0
 * @category Layers
 */
export const TasksLayerLocalSocket: Layer.Layer<TasksService, never, HttpClient.HttpClient> =
    TasksService.Default as Layer.Layer<TasksService, never, HttpClient.HttpClient>;
