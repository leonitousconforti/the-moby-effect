import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmUpdateConfig extends Schema.Class<SwarmUpdateConfig>("SwarmUpdateConfig")(
    {
        Parallelism: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        Delay: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        FailureAction: Schema.optional(Schema.String),
        Monitor: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        MaxFailureRatio: MobyNumber.NumberFromWireString,
        Order: Schema.String,
    },
    {
        identifier: "SwarmUpdateConfig",
        title: "swarm.UpdateConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#UpdateConfig",
    }
) {}
