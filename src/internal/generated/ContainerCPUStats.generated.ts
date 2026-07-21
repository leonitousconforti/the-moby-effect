import * as Schema from "effect/Schema";

import * as ContainerCPUUsage from "./ContainerCPUUsage.generated.ts";
import * as ContainerThrottlingData from "./ContainerThrottlingData.generated.ts";

export class ContainerCPUStats extends Schema.Class<ContainerCPUStats>("ContainerCPUStats")(
    {
        cpu_usage: Schema.NullOr(ContainerCPUUsage.ContainerCPUUsage),
        system_cpu_usage: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        online_cpus: Schema.optional(
            Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))
        ),
        throttling_data: Schema.optional(Schema.NullOr(ContainerThrottlingData.ContainerThrottlingData)),
    },
    {
        identifier: "ContainerCPUStats",
        title: "container.CPUStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CPUStats",
    }
) {}
