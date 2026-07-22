import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmServiceStatus extends Schema.Class<SwarmServiceStatus>("SwarmServiceStatus")(
    {
        RunningTasks: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        DesiredTasks: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        CompletedTasks: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
    },
    {
        identifier: "SwarmServiceStatus",
        title: "swarm.ServiceStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ServiceStatus",
    }
) {}
