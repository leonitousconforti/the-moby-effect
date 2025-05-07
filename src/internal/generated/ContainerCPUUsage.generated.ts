import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerCPUUsage extends Schema.Class<ContainerCPUUsage>("ContainerCPUUsage")(
    {
        /**
         * Total CPU time consumed.
         *
         * Linux units: nanoseconds. Windows units: 100's of nanoseconds
         */
        total_usage: MobySchemas.UInt64,

        /**
         * Linux: total CPU time consumed per core. Windows: not used.
         *
         * Units: nanoseconds.
         */
        percpu_usage: Schema.optionalWith(Schema.Array(MobySchemas.UInt64), { nullable: true }),

        /**
         * Linux: time spent by tasks of the cgroup in kernel mode, units
         * nanoseconds
         *
         * Windows: time spent by all container processes in kernel mode, units
         * 100's of nanoseconds. Not populated for Hyper-V Containers.
         */
        usage_in_kernelmode: MobySchemas.UInt64,

        /**
         * Linux: time spent by tasks of the cgroup in user mode, units
         * nanoseconds
         *
         * Windows: time spent by all container processes in user mode, units
         * 100's of nanoseconds. Not populated for Hyper-V Containers.
         */
        usage_in_usermode: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerCPUUsage",
        title: "container.CPUUsage",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/stats.go#L16-L38",
    }
) {}
