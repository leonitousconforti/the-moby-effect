import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmDispatcherConfig extends Schema.Class<SwarmDispatcherConfig>("SwarmDispatcherConfig")(
    {
        HeartbeatPeriod: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
    },
    {
        identifier: "SwarmDispatcherConfig",
        title: "swarm.DispatcherConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DispatcherConfig",
    }
) {}
