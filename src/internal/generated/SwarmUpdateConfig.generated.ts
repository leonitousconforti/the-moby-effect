import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmUpdateConfig extends Schema.Class<SwarmUpdateConfig>("SwarmUpdateConfig")(
    {
        /**
         * Maximum number of tasks to be updated in one iteration. 0 means
         * unlimited parallelism.
         */
        Parallelism: MobySchemas.UInt64,

        /** Amount of time between updates. */
        Delay: Schema.optional(MobySchemas.Int64),

        /** FailureAction is the action to take when an update failures. */
        FailureAction: Schema.optional(Schema.String),

        /**
         * Monitor indicates how long to monitor a task for failure after it is
         * created. If the task fails by ending up in one of the states
         * REJECTED, COMPLETED, or FAILED, within Monitor from its creation,
         * this counts as a failure. If it fails after Monitor, it does not
         * count as a failure. If Monitor is unspecified, a default value will
         * be used.
         */
        Monitor: Schema.optional(MobySchemas.Int64),

        /**
         * MaxFailureRatio is the fraction of tasks that may fail during an
         * update before the failure action is invoked. Any task created by the
         * current update which ends up in one of the states REJECTED, COMPLETED
         * or FAILED within Monitor from its creation counts as a failure. The
         * number of failures is divided by the number of tasks being updated,
         * and if this fraction is greater than MaxFailureRatio, the failure
         * action is invoked.
         *
         * If the failure action is CONTINUE, there is no effect. If the failure
         * action is PAUSE, no more tasks will be updated until another update
         * is started.
         */
        MaxFailureRatio: Schema.Number,

        /**
         * Order indicates the order of operations when rolling out an updated
         * task. Either the old task is shut down before the new task is
         * started, or the new task is started before the old task is shut
         * down.
         */
        Order: Schema.String,
    },
    {
        identifier: "SwarmUpdateConfig",
        title: "swarm.UpdateConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L126-L163",
    }
) {}
