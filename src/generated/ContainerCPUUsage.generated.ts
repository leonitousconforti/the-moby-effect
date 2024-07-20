import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerCPUUsage extends Schema.Class<ContainerCPUUsage>("ContainerCPUUsage")(
    {
        total_usage: MobySchemas.UInt64,
        percpu_usage: Schema.optional(Schema.Array(MobySchemas.UInt64), { nullable: true }),
        usage_in_kernelmode: MobySchemas.UInt64,
        usage_in_usermode: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerCPUUsage",
        title: "container.CPUUsage",
    }
) {}
