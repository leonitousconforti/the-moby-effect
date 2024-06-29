import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { EndpointSpec } from "./EndpointSpec.js";
import { NetworkAttachmentConfig } from "./NetworkAttachmentConfig.js";
import { TaskSpec } from "./TaskSpec.js";

/** User modifiable configuration for a service. */
export const ServiceSpec = S.Struct({
    /** Name of the service. */
    Name: S.optional(S.String),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    TaskTemplate: S.optional(TaskSpec),
    /** Scheduling mode for the service. */
    Mode: S.optional(
        S.Struct({
            Replicated: S.optional(
                S.Struct({
                    Replicas: S.optional(pipe(S.Number, S.int())),
                })
            ),
            Global: S.optional(S.Struct({})),
            /**
             * The mode used for services with a finite number of tasks that run
             * to a completed state.
             */
            ReplicatedJob: S.optional(
                S.Struct({
                    /** The maximum number of replicas to run simultaneously. */
                    MaxConcurrent: S.optional(pipe(S.Number, S.int()), {
                        default: () => 1,
                    }),
                    /**
                     * The total number of replicas desired to reach the
                     * Completed state. If unset, will default to the value of
                     * `MaxConcurrent`
                     */
                    TotalCompletions: S.optional(pipe(S.Number, S.int())),
                })
            ),
            /**
             * The mode used for services which run a task to the completed
             * state on each valid node.
             */
            GlobalJob: S.optional(S.Struct({})),
        })
    ),
    /** Specification for the update strategy of the service. */
    UpdateConfig: S.optional(
        S.Struct({
            /**
             * Maximum number of tasks to be updated in one iteration (0 means
             * unlimited parallelism).
             */
            Parallelism: S.optional(pipe(S.Number, S.int())),
            /** Amount of time between updates, in nanoseconds. */
            Delay: S.optional(pipe(S.Number, S.int())),
            /**
             * Action to take if an updated task fails to run, or stops running
             * during the update.
             */
            FailureAction: S.optional(S.Literal("continue", "pause", "rollback")),
            /**
             * Amount of time to monitor each updated task for failures, in
             * nanoseconds.
             */
            Monitor: S.optional(pipe(S.Number, S.int())),
            /**
             * The fraction of tasks that may fail during an update before the
             * failure action is invoked, specified as a floating point number
             * between 0 and 1.
             */
            MaxFailureRatio: S.optional(S.Number),
            /**
             * The order of operations when rolling out an updated task. Either
             * the old task is shut down before the new task is started, or the
             * new task is started before the old task is shut down.
             */
            Order: S.optional(S.Literal("stop-first", "start-first")),
        })
    ),
    /** Specification for the rollback strategy of the service. */
    RollbackConfig: S.optional(
        S.Struct({
            /**
             * Maximum number of tasks to be rolled back in one iteration (0
             * means unlimited parallelism).
             */
            Parallelism: S.optional(pipe(S.Number, S.int())),
            /** Amount of time between rollback iterations, in nanoseconds. */
            Delay: S.optional(pipe(S.Number, S.int())),
            /**
             * Action to take if an rolled back task fails to run, or stops
             * running during the rollback.
             */
            FailureAction: S.optional(S.Literal("continue", "pause")),
            /**
             * Amount of time to monitor each rolled back task for failures, in
             * nanoseconds.
             */
            Monitor: S.optional(pipe(S.Number, S.int())),
            /**
             * The fraction of tasks that may fail during a rollback before the
             * failure action is invoked, specified as a floating point number
             * between 0 and 1.
             */
            MaxFailureRatio: S.optional(S.Number),
            /**
             * The order of operations when rolling back a task. Either the old
             * task is shut down before the new task is started, or the new task
             * is started before the old task is shut down.
             */
            Order: S.optional(S.Literal("stop-first", "start-first")),
        })
    ),
    /**
     * Specifies which networks the service should attach to.
     *
     * Deprecated: This field is deprecated since v1.44. The Networks field in
     * TaskSpec should be used instead.
     */
    Networks: S.optional(S.Array(NetworkAttachmentConfig)),
    EndpointSpec: S.optional(EndpointSpec),
});

export type ServiceSpec = S.Schema.Type<typeof ServiceSpec>;
export const ServiceSpecEncoded = S.encodedSchema(ServiceSpec);
export type ServiceSpecEncoded = S.Schema.Encoded<typeof ServiceSpec>;
