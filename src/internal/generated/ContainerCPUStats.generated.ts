import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as ContainerCPUUsage from "./ContainerCPUUsage.generated.js";
import * as ContainerThrottlingData from "./ContainerThrottlingData.generated.js";

export class ContainerCPUStats extends Schema.Class<ContainerCPUStats>("ContainerCPUStats")(
    {
        cpu_usage: Schema.NullOr(ContainerCPUUsage.ContainerCPUUsage),
        system_cpu_usage: Schema.optional(EffectSchemas.Number.U64),
        online_cpus: Schema.optional(EffectSchemas.Number.U32),
        throttling_data: Schema.optionalWith(ContainerThrottlingData.ContainerThrottlingData, { nullable: true }),
    },
    {
        identifier: "ContainerCPUStats",
        title: "container.CPUStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CPUStats",
    }
) {}
