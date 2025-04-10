import type * as HttpClientError from "@effect/platform/HttpClientError";
import type * as Layer from "effect/Layer";
import type * as ParseResult from "effect/ParseResult";

import * as PlatformError from "@effect/platform/Error";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import { SwarmTask } from "../generated/index.js";
import { maybeAddQueryParameter } from "./common.js";

/**
 * @since 1.0.0
 * @category Errors
 */
export const TasksErrorTypeId: unique symbol = Symbol.for("@the-moby-effect/endpoints/TasksError") as TasksErrorTypeId;

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
export class TasksError extends PlatformError.TypeIdError(TasksErrorTypeId, "TasksError")<{
    method: string;
    cause: ParseResult.ParseError | HttpClientError.HttpClientError | unknown;
}> {
    get message() {
        return `${this.method}`;
    }
}

/**
 * A task is a container running on a swarm. It is the atomic scheduling unit of
 * swarm. Swarm mode must be enabled for these endpoints to work.
 *
 * @since 1.0.0
 * @category Tags
 * @see https://docs.docker.com/reference/api/engine/latest/#tag/Task
 */
export class Tasks extends Effect.Service<Tasks>()("@the-moby-effect/endpoints/Tasks", {
    accessors: false,
    dependencies: [],

    effect: Effect.gen(function* () {
        const defaultClient = yield* HttpClient.HttpClient;
        const client = defaultClient.pipe(HttpClient.filterStatusOk);

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskList */
        const list_ = (
            options?:
                | {
                      readonly filters?: {
                          "desired-state"?: ["running" | "shutdown" | "accepted"] | undefined;
                          id?: [string] | undefined;
                          name?: [string] | undefined;
                          node?: [string] | undefined;
                          service?: [string] | undefined;
                          label?: Array<string> | undefined;
                      };
                  }
                | undefined
        ): Effect.Effect<Readonly<Array<SwarmTask>>, TasksError, never> =>
            Function.pipe(
                HttpClientRequest.get("/tasks"),
                maybeAddQueryParameter(
                    "filters",
                    Function.pipe(options?.filters, Option.fromNullable, Option.map(JSON.stringify))
                ),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(Schema.Array(SwarmTask))),
                Effect.mapError((cause) => new TasksError({ method: "list", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskInspect */
        const inspect_ = (id: string): Effect.Effect<Readonly<SwarmTask>, TasksError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/tasks/${encodeURIComponent(id)}`),
                client.execute,
                Effect.flatMap(HttpClientResponse.schemaBodyJson(SwarmTask)),
                Effect.mapError((cause) => new TasksError({ method: "inspect", cause }))
            );

        /** @see https://docs.docker.com/reference/api/engine/latest/#tag/Task/operation/TaskLogs */
        const logs_ = (
            id: string,
            options?:
                | {
                      readonly details?: boolean;
                      readonly follow?: boolean;
                      readonly stdout?: boolean;
                      readonly stderr?: boolean;
                      readonly since?: number;
                      readonly timestamps?: boolean;
                      readonly tail?: string;
                  }
                | undefined
        ): Stream.Stream<string, TasksError, never> =>
            Function.pipe(
                HttpClientRequest.get(`/tasks/${encodeURIComponent(id)}/logs`),
                maybeAddQueryParameter("details", Option.fromNullable(options?.details)),
                maybeAddQueryParameter("follow", Option.fromNullable(options?.follow)),
                maybeAddQueryParameter("stdout", Option.fromNullable(options?.stdout)),
                maybeAddQueryParameter("stderr", Option.fromNullable(options?.stderr)),
                maybeAddQueryParameter("since", Option.fromNullable(options?.since)),
                maybeAddQueryParameter("timestamps", Option.fromNullable(options?.timestamps)),
                maybeAddQueryParameter("tail", Option.fromNullable(options?.tail)),
                client.execute,
                HttpClientResponse.stream,
                Stream.decodeText(),
                Stream.mapError((cause) => new TasksError({ method: "logs", cause }))
            );

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
export const TasksLayer: Layer.Layer<Tasks, never, HttpClient.HttpClient> = Tasks.Default;
