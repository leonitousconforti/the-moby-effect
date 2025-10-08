import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerCPUUsage extends Schema.Class<ContainerCPUUsage>("ContainerCPUUsage")(
    {
        total_usage: EffectSchemas.Number.U64,
        percpu_usage: Schema.optionalWith(Schema.Array(EffectSchemas.Number.U64), { nullable: true }),
        usage_in_kernelmode: EffectSchemas.Number.U64,
        usage_in_usermode: EffectSchemas.Number.U64,
    },
    {
        identifier: "ContainerCPUUsage",
        title: "container.CPUUsage",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CPUUsage",
    }
) {}
