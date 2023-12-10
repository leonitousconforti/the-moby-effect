import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Data, Effect } from "effect";

import { IMobyConnectionAgent, MobyConnectionAgent, WithConnectionAgentProvided } from "./agent-helpers.js";
import { addQueryParameter, errorHandler } from "./request-helpers.js";
import { Task, TaskSchema } from "./schemas.js";

export class TaskInspectError extends Data.TaggedError("TaskInspectError")<{ message: string }> {}
export class TaskListError extends Data.TaggedError("TaskListError")<{ message: string }> {}
export class TaskLogsError extends Data.TaggedError("TaskLogsError")<{ message: string }> {}

export interface taskInspectOptions {
    /** ID of the task */
    id: string;
}

export interface taskListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the tasks list. Available filters:
     *
     * - `desired-state=(running | shutdown | accepted)`
     * - `id=<task id>`
     * - `label=key` or `label=\"key=value\"`
     * - `name=<task name>`
     * - `node=<node id or name>`
     * - `service=<service name>`
     */
    filters?: string;
}

export interface taskLogsOptions {
    /** ID of the task */
    id: string;
    /** Show task context and extra details provided to logs. */
    details?: boolean;
    /** Keep connection after returning logs. */
    follow?: boolean;
    /** Return logs from `stdout` */
    stdout?: boolean;
    /** Return logs from `stderr` */
    stderr?: boolean;
    /** Only return logs since this time, as a UNIX timestamp */
    since?: number;
    /** Add timestamps to every log line */
    timestamps?: boolean;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    tail?: string;
}

/**
 * Inspect a task
 *
 * @param id - ID of the task
 */
export const taskInspect = (
    options: taskInspectOptions
): Effect.Effect<IMobyConnectionAgent, TaskInspectError, Readonly<Task>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new TaskInspectError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/tasks/{id}";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(TaskSchema)))
            .pipe(errorHandler(TaskInspectError));
    }).pipe(Effect.flatten);

/**
 * List tasks
 *
 * @param filters - A JSON encoded value of the filters (a
 *   `map[string][]string`) to process on the tasks list. Available filters: -
 *   `desired-state=(running | shutdown | accepted)`
 *
 *   - `id=<task id>`
 *   - `label=key` or `label=\"key=value\"`
 *   - `name=<task name>`
 *   - `node=<node id or name>`
 *   - `service=<service name>`
 */
export const taskList = (
    options: taskListOptions
): Effect.Effect<IMobyConnectionAgent, TaskListError, Readonly<Array<Task>>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        const endpoint: string = "/tasks";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint;

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("filters", options.filters))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap(NodeHttp.response.schemaBodyJson(Schema.array(TaskSchema))))
            .pipe(errorHandler(TaskListError));
    }).pipe(Effect.flatten);

/**
 * Get `stdout` and `stderr` logs from a task. See also
 * [`/containers/{id}/logs`](#operation/ContainerLogs). **Note**: This endpoint
 * works only for services with the `local`, `json-file` or `journald` logging
 * drivers.
 *
 * @param id - ID of the task
 * @param details - Show task context and extra details provided to logs.
 * @param follow - Keep connection after returning logs.
 * @param stdout - Return logs from `stdout`
 * @param stderr - Return logs from `stderr`
 * @param since - Only return logs since this time, as a UNIX timestamp
 * @param timestamps - Add timestamps to every log line
 * @param tail - Only return this number of log lines from the end of the logs.
 *   Specify as an integer or `all` to output all log lines.
 */
export const taskLogs = (
    options: taskLogsOptions
): Effect.Effect<IMobyConnectionAgent, TaskLogsError, Readonly<Blob>> =>
    Effect.gen(function* (_: Effect.Adapter) {
        if (options.id === null || options.id === undefined) {
            yield* _(new TaskLogsError({ message: "Required parameter id was null or undefined" }));
        }

        const endpoint: string = "/tasks/{id}/logs";
        const method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" = "GET";
        const sanitizedEndpoint: string = endpoint.replace(`{${"id"}}`, encodeURIComponent(String(options.id)));

        const agent: IMobyConnectionAgent = yield* _(MobyConnectionAgent);
        const url: string = `${agent.connectionOptions.protocol === "https" ? "https" : "http"}://0.0.0.0`;
        const client: NodeHttp.client.Client.Default = yield* _(
            NodeHttp.nodeClient.make.pipe(Effect.provideService(NodeHttp.nodeClient.HttpAgent, agent))
        );

        return NodeHttp.request
            .make(method)(sanitizedEndpoint)
            .pipe(NodeHttp.request.prependUrl(url))
            .pipe(addQueryParameter("details", options.details))
            .pipe(addQueryParameter("follow", options.follow))
            .pipe(addQueryParameter("stdout", options.stdout))
            .pipe(addQueryParameter("stderr", options.stderr))
            .pipe(addQueryParameter("since", options.since))
            .pipe(addQueryParameter("timestamps", options.timestamps))
            .pipe(addQueryParameter("tail", options.tail))
            .pipe(client.pipe(NodeHttp.client.filterStatusOk))
            .pipe(Effect.flatMap((clientResponse) => clientResponse.text))
            .pipe(Effect.map((responseText) => new Blob([responseText])))
            .pipe(errorHandler(TaskLogsError));
    }).pipe(Effect.flatten);

export interface ITaskService {
    /**
     * Inspect a task
     *
     * @param id - ID of the task
     */
    taskInspect: WithConnectionAgentProvided<typeof taskInspect>;

    /**
     * List tasks
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the tasks list. Available
     *   filters:
     *
     *   - `desired-state=(running | shutdown | accepted)`
     *   - `id=<task id>`
     *   - `label=key` or `label=\"key=value\"`
     *   - `name=<task name>`
     *   - `node=<node id or name>`
     *   - `service=<service name>`
     */
    taskList: WithConnectionAgentProvided<typeof taskList>;

    /**
     * Get `stdout` and `stderr` logs from a task. See also
     * [`/containers/{id}/logs`](#operation/ContainerLogs). **Note**: This
     * endpoint works only for services with the `local`, `json-file` or
     * `journald` logging drivers.
     *
     * @param id - ID of the task
     * @param details - Show task context and extra details provided to logs.
     * @param follow - Keep connection after returning logs.
     * @param stdout - Return logs from `stdout`
     * @param stderr - Return logs from `stderr`
     * @param since - Only return logs since this time, as a UNIX timestamp
     * @param timestamps - Add timestamps to every log line
     * @param tail - Only return this number of log lines from the end of the
     *   logs. Specify as an integer or `all` to output all log lines.
     */
    taskLogs: WithConnectionAgentProvided<typeof taskLogs>;
}
