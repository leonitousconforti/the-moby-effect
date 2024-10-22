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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L40-L53",
    }
) {}
