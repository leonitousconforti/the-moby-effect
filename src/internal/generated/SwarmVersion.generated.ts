import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmVersion extends Schema.Class<SwarmVersion>("SwarmVersion")(
    {
        Index: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
    },
    {
        identifier: "SwarmVersion",
        title: "swarm.Version",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Version",
    }
) {}
