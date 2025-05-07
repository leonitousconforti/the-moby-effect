import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerCPUUsage from "./ContainerCPUUsage.generated.js";
import * as ContainerThrottlingData from "./ContainerThrottlingData.generated.js";

export class ContainerCPUStats extends Schema.Class<ContainerCPUStats>("ContainerCPUStats")(
    {
        /** CPU Usage. Linux and Windows. */
        cpu_usage: Schema.NullOr(ContainerCPUUsage.ContainerCPUUsage),

        /** System Usage. Linux only. */
        system_cpu_usage: Schema.optional(MobySchemas.UInt64),

        /** Online CPUs. Linux only. */
        online_cpus: Schema.optional(MobySchemas.UInt32),

        /** Throttling Data. Linux only. */
        throttling_data: Schema.optionalWith(ContainerThrottlingData.ContainerThrottlingData, { nullable: true }),
    },
    {
        identifier: "ContainerCPUStats",
        title: "container.CPUStats",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/stats.go#L40-L53",
    }
) {}
