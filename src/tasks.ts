import * as HttpClient from "@effect/platform/HttpClient";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import {
    IMobyConnectionAgent,
    MobyConnectionAgent,
    MobyConnectionOptions,
    MobyHttpClientLive,
    getAgent,
} from "./agent-helpers.js";
import { addQueryParameter, responseErrorHandler, streamErrorHandler } from "./request-helpers.js";
import { Task } from "./schemas.js";

export class TasksError extends Data.TaggedError("TasksError")<{
    method: string;
    message: string;
}> {}

export interface TaskListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the tasks list.
     *
     * Available filters:
     *
     * - `desired-state=(running | shutdown | accepted)`
     * - `id=<task id>`
     * - `label=key` or `label="key=value"`
     * - `name=<task name>`
     * - `node=<node id or name>`
     * - `service=<service name>`
     */
    readonly filters?: {
        "desired-state"?: ["running" | "shutdown" | "accepted"] | undefined;
        id?: [string] | undefined;
        label?: string[] | undefined;
        name?: [string] | undefined;
        node?: [string] | undefined;
        service?: [string] | undefined;
    };
}

export interface TaskInspectOptions {
    /** ID of the task */
    readonly id: string;
}

export interface TaskLogsOptions {
    /** ID of the task */
    readonly id: string;
    /** Show task context and extra details provided to logs. */
    readonly details?: boolean;
    /** Keep connection after returning logs. */
    readonly follow?: boolean;
    /** Return logs from `stdout` */
    readonly stdout?: boolean;
    /** Return logs from `stderr` */
    readonly stderr?: boolean;
    /** Only return logs since this time, as a UNIX timestamp */
    readonly since?: number;
    /** Add timestamps to every log line */
    readonly timestamps?: boolean;
    /**
     * Only return this number of log lines from the end of the logs. Specify as
     * an integer or `all` to output all log lines.
     */
    readonly tail?: string;
}

export interface Tasks {
    /**
     * List tasks
     *
     * @param filters - A JSON encoded value of the filters (a
     *   `map[string][]string`) to process on the tasks list.
     *
     *   Available filters:
     *
     *   - `desired-state=(running | shutdown | accepted)`
     *   - `id=<task id>`
     *   - `label=key` or `label="key=value"`
     *   - `name=<task name>`
     *   - `node=<node id or name>`
     *   - `service=<service name>`
     */
    readonly list: (options?: TaskListOptions | undefined) => Effect.Effect<Readonly<Array<Task>>, TasksError>;

    /**
     * Inspect a task
     *
     * @param id - ID of the task
     */
    readonly inspect: (options: TaskInspectOptions) => Effect.Effect<Readonly<Task>, TasksError>;

    /**
     * Get task logs
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
    readonly logs: (options: TaskLogsOptions) => Effect.Effect<Readonly<Stream.Stream<string, TasksError>>, TasksError>;
}

const make: Effect.Effect<Tasks, never, IMobyConnectionAgent | HttpClient.client.Client.Default> = Effect.gen(
    function* (_) {
        const agent = yield* _(MobyConnectionAgent);
        const defaultClient = yield* _(HttpClient.client.Client);

        const client = defaultClient.pipe(
            HttpClient.client.mapRequest(HttpClient.request.prependUrl(`${agent.nodeRequestUrl}/tasks`)),
            HttpClient.client.filterStatusOk
        );

        const TasksClient = client.pipe(
            HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Schema.array(Task)))
        );
        const TaskClient = client.pipe(HttpClient.client.mapEffect(HttpClient.response.schemaBodyJson(Task)));

        const streamHandler = (method: string) => streamErrorHandler((message) => new TasksError({ method, message }));
        const responseHandler = (method: string) =>
            responseErrorHandler((message) => new TasksError({ method, message }));

        const list_ = (options?: TaskListOptions | undefined): Effect.Effect<Readonly<Array<Task>>, TasksError> =>
            Function.pipe(
                HttpClient.request.get(""),
                addQueryParameter("filters", JSON.stringify(options?.filters)),
                TasksClient,
                Effect.catchAll(responseHandler("list")),
                Effect.scoped
            );

        const inspect_ = (options: TaskInspectOptions): Effect.Effect<Readonly<Task>, TasksError> =>
            Function.pipe(
                HttpClient.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
                TaskClient,
                Effect.catchAll(responseHandler("inspect")),
                Effect.scoped
            );

        const logs_ = (options: TaskLogsOptions): Effect.Effect<Stream.Stream<string, TasksError>, TasksError> =>
            Function.pipe(
                HttpClient.request.get("/{id}/logs".replace("{id}", encodeURIComponent(options.id))),
                addQueryParameter("details", options.details),
                addQueryParameter("follow", options.follow),
                addQueryParameter("stdout", options.stdout),
                addQueryParameter("stderr", options.stderr),
                addQueryParameter("since", options.since),
                addQueryParameter("timestamps", options.timestamps),
                addQueryParameter("tail", options.tail),
                client,
                Effect.map((response) => response.stream),
                Effect.map(Stream.decodeText("utf8")),
                Effect.map(Stream.catchAll(streamHandler("logs"))),
                Effect.catchAll(responseHandler("logs")),
                Effect.scoped
            );

        return { list: list_, inspect: inspect_, logs: logs_ };
    }
);

export const Tasks = Context.GenericTag<Tasks>("the-moby-effect/Tasks");
export const layer = Layer.effect(Tasks, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<IMobyConnectionAgent, never, Scope.Scope>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
