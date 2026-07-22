import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerCPUUsage extends Schema.Class<ContainerCPUUsage>("ContainerCPUUsage")(
    {
        total_usage: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        percpu_usage: Schema.optional(
            Schema.NullOr(
                Schema.Array(
                    MobyNumber.BigIntFromWireString.check(
                        Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
                    )
                )
            )
        ),
        usage_in_kernelmode: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        usage_in_usermode: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
    },
    {
        identifier: "ContainerCPUUsage",
        title: "container.CPUUsage",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CPUUsage",
    }
) {}
