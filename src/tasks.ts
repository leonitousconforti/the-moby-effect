import * as NodeHttp from "@effect/platform-node/HttpClient";
import * as Schema from "@effect/schema/Schema";
import { Context, Data, Effect, Layer, Scope, Stream, pipe } from "effect";

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
    readonly list: (options?: TaskListOptions | undefined) => Effect.Effect<never, TasksError, Readonly<Array<Task>>>;

    /**
     * Inspect a task
     *
     * @param id - ID of the task
     */
    readonly inspect: (options: TaskInspectOptions) => Effect.Effect<never, TasksError, Readonly<Task>>;

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
    readonly logs: (
        options: TaskLogsOptions
    ) => Effect.Effect<never, TasksError, Readonly<Stream.Stream<never, TasksError, string>>>;
}

const make: Effect.Effect<IMobyConnectionAgent | NodeHttp.client.Client.Default, never, Tasks> = Effect.gen(function* (
    _: Effect.Adapter
) {
    const agent = yield* _(MobyConnectionAgent);
    const defaultClient = yield* _(NodeHttp.client.Client);

    const client = defaultClient.pipe(
        NodeHttp.client.mapRequest(NodeHttp.request.prependUrl(`${agent.nodeRequestUrl}/tasks`)),
        NodeHttp.client.filterStatusOk
    );

    const TasksClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Schema.array(Task))));
    const TaskClient = client.pipe(NodeHttp.client.mapEffect(NodeHttp.response.schemaBodyJson(Task)));

    const streamHandler = (method: string) => streamErrorHandler((message) => new TasksError({ method, message }));
    const responseHandler = (method: string) => responseErrorHandler((message) => new TasksError({ method, message }));

    const list_ = (options?: TaskListOptions | undefined): Effect.Effect<never, TasksError, Readonly<Array<Task>>> =>
        pipe(
            NodeHttp.request.get(""),
            addQueryParameter("filters", JSON.stringify(options?.filters ?? {})),
            TasksClient,
            Effect.catchAll(responseHandler("list"))
        );

    const inspect_ = (options: TaskInspectOptions): Effect.Effect<never, TasksError, Readonly<Task>> =>
        pipe(
            NodeHttp.request.get("/{id}".replace("{id}", encodeURIComponent(options.id))),
            TaskClient,
            Effect.catchAll(responseHandler("inspect"))
        );

    const logs_ = (
        options: TaskLogsOptions
    ): Effect.Effect<never, TasksError, Stream.Stream<never, TasksError, string>> =>
        pipe(
            NodeHttp.request.get("/{id}/logs".replace("{id}", encodeURIComponent(options.id))),
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
            Effect.catchAll(responseHandler("logs"))
        );

    return { list: list_, inspect: inspect_, logs: logs_ };
});

export const Tasks = Context.Tag<Tasks>("the-moby-effect/Tasks");
export const layer = Layer.effect(Tasks, make).pipe(Layer.provide(MobyHttpClientLive));

export const fromAgent = (agent: Effect.Effect<Scope.Scope, never, IMobyConnectionAgent>) =>
    layer.pipe(Layer.provide(Layer.scoped(MobyConnectionAgent, agent)));

export const fromConnectionOptions = (connectionOptions: MobyConnectionOptions) =>
    fromAgent(getAgent(connectionOptions));
