import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerCPUStats extends Schema.Class<ContainerCPUStats>("ContainerCPUStats")(
    {
        cpu_usage: MobySchemasGenerated.ContainerCPUUsage,
        system_cpu_usage: Schema.optional(MobySchemas.UInt64),
        online_cpus: Schema.optional(MobySchemas.UInt32),
        throttling_data: Schema.optional(MobySchemasGenerated.ContainerThrottlingData),
    },
    {
        identifier: "ContainerCPUStats",
        title: "container.CPUStats",
    }
) {}
