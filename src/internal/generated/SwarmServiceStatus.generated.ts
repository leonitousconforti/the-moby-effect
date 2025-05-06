import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmServiceStatus extends Schema.Class<SwarmServiceStatus>("SwarmServiceStatus")(
    {
        /**
         * RunningTasks is the number of tasks for the service actually in the
         * Running state
         */
        RunningTasks: MobySchemas.UInt64,

        /**
         * DesiredTasks is the number of tasks desired to be running by the
         * service. For replicated services, this is the replica count. For
         * global services, this is computed by taking the number of tasks with
         * desired state of not-Shutdown.
         */
        DesiredTasks: MobySchemas.UInt64,

        /**
         * CompletedTasks is the number of tasks in the state Completed, if this
         * service is in ReplicatedJob or GlobalJob mode. This field must be
         * cross-referenced with the service type, because the default value of
         * 0 may mean that a service is not in a job mode, or it may mean that
         * the job has yet to complete any tasks.
         */
        CompletedTasks: MobySchemas.UInt64,
    },
    {
        identifier: "SwarmServiceStatus",
        title: "swarm.ServiceStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L165-L184",
    }
) {}
