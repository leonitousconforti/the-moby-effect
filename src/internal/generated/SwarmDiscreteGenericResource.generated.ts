import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmDiscreteGenericResource extends Schema.Class<SwarmDiscreteGenericResource>(
    "SwarmDiscreteGenericResource"
)(
    {
        Kind: Schema.optional(Schema.String),
        Value: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
    },
    {
        identifier: "SwarmDiscreteGenericResource",
        title: "swarm.DiscreteGenericResource",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DiscreteGenericResource",
    }
) {}
