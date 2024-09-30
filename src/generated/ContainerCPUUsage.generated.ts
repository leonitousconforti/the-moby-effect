import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L16-L38",
    }
) {}
