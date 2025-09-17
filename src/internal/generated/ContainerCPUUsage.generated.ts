import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerCPUUsage extends Schema.Class<ContainerCPUUsage>("ContainerCPUUsage")(
    {
        total_usage: MobySchemas.UInt64,
        percpu_usage: Schema.optionalWith(Schema.Array(MobySchemas.UInt64), { nullable: true }),
        usage_in_kernelmode: MobySchemas.UInt64,
        usage_in_usermode: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerCPUUsage",
        title: "container.CPUUsage",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CPUUsage",
    }
) {}
