/**
 * Tasks service
 *
 * @since 1.0.0
 */

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientError from "@effect/platform/HttpClientError";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Stream from "effect/Stream";

import { SwarmTask } from "../generated/index.js";
import { maybeAddQueryParameter } from "./Common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const TasksErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/moby/TasksError");

/**
 * @since 1.0.0
 * @category Errors
 */
export type TasksErrorTypeId = typeof TasksErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isTasksError = (u: unknown): u is TasksError => Predicate.hasProperty(u, TasksErrorTypeId);

/**
 * @since 1.0.0
 * @category Errors
 */
export class TasksError extends PlatformError.RefailError(TasksErrorTypeId, "TasksError")<{
    method: string;
    error: ParseResult.ParseError | HttpClientError.HttpClientError;
}> {
    get message() {
        return `${this.method}: ${super.message}`;
    }
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface TaskListOptions {
    /**
     * A JSON encoded value of the filters (a `map[string][]string`) to process
     * on the tasks list.
     *
     * Available filters:
     *
     * - `desired-state=(running | shutdown | accepted)`
     * - `id=<task id>`
     * - `name=<task name>`
     * - `node=<node id or name>`
     * - `service=<service name>`
     * - `label=key` or `label="key=value"`
     */
    readonly filters?: {
        "desired-state"?: ["running" | "shutdown" | "accepted"] | undefined;
        id?: [string] | undefined;
        name?: [string] | undefined;
        node?: [string] | undefined;
        service?: [string] | undefined;
        label?: Array<string> | undefined;
    };
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface TaskInspectOptions {
    /** ID of the task */
    readonly id: string;
}

/**
 * @since 1.0.0
 * @category Params
 */
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

/**
 * @since 1.0.0
 * @category Tags
 */
export interface TasksImpl {
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
     *   - `name=<task name>`
     *   - `node=<node id or name>`
     *   - `service=<service name>`
     *   - `label=key` or `label="key=value"`
     */
    readonly list: (
        options?: TaskListOptions | undefined
    ) => Effect.Effect<Readonly<Array<SwarmTask>>, TasksError, never>;

    /**
     * Inspect a task
     *
     * @param id - ID of the task
     */
    readonly inspect: (options: TaskInspectOptions) => Effect.Effect<Readonly<SwarmTask>, TasksError, never>;

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
    readonly logs: (options: TaskLogsOptions) => Stream.Stream<string, TasksError, never>;
}

/**
 * @since 1.0.0
 * @category Services
 */
export const make: Effect.Effect<TasksImpl, never, HttpClient.HttpClient.Default> = Effect.gen(function* () {
    const defaultClient = yield* HttpClient.HttpClient;

    const client = defaultClient.pipe(
        HttpClient.mapRequest(HttpClientRequest.prependUrl("/tasks")),
        HttpClient.filterStatusOk
    );

    const TaskClient = client.pipe(HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(SwarmTask)));
    const TasksClient = client.pipe(
        HttpClient.transformResponse(HttpClientResponse.schemaBodyJsonScoped(Schema.Array(SwarmTask)))
    );

    const list_ = (
        options?: TaskListOptions | undefined
    ): Effect.Effect<Readonly<Array<SwarmTask>>, TasksError, never> =>
        Function.pipe(
            HttpClientRequest.get(""),
            maybeAddQueryParameter(
                "filters",
                Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
            ),
            TasksClient,
            Effect.mapError((error) => new TasksError({ method: "list", error })),
            Effect.scoped
        );

    const inspect_ = (options: TaskInspectOptions): Effect.Effect<Readonly<SwarmTask>, TasksError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}`),
            TaskClient,
            Effect.mapError((error) => new TasksError({ method: "inspect", error })),
            Effect.scoped
        );

    const logs_ = (options: TaskLogsOptions): Stream.Stream<string, TasksError, never> =>
        Function.pipe(
            HttpClientRequest.get(`/${encodeURIComponent(options.id)}/logs`),
            maybeAddQueryParameter("details", Option.fromNullable(options.details)),
            maybeAddQueryParameter("follow", Option.fromNullable(options.follow)),
            maybeAddQueryParameter("stdout", Option.fromNullable(options.stdout)),
            maybeAddQueryParameter("stderr", Option.fromNullable(options.stderr)),
            maybeAddQueryParameter("since", Option.fromNullable(options.since)),
            maybeAddQueryParameter("timestamps", Option.fromNullable(options.timestamps)),
            maybeAddQueryParameter("tail", Option.fromNullable(options.tail)),
            client,
            HttpClientResponse.stream,
            Stream.decodeText("utf8"),
            Stream.mapError((error) => new TasksError({ method: "logs", error }))
        );

    return { list: list_, inspect: inspect_, logs: logs_ };
});

/**
 * @since 1.0.0
 * @category Tags
 */
export interface Tasks {
    readonly _: unique symbol;
}

/**
 * Tasks service
 *
 * @since 1.0.0
 * @category Tags
 */
export const Tasks: Context.Tag<Tasks, TasksImpl> = Context.GenericTag<Tasks, TasksImpl>("@the-moby-effect/moby/Tasks");

/**
 * Configs layer that depends on the MobyConnectionAgent
 *
 * @since 1.0.0
 * @category Layers
 */
export const layer: Layer.Layer<Tasks, never, HttpClient.HttpClient.Default> = Layer.effect(Tasks, make);
