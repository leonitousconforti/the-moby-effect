import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmReplicatedJob extends Schema.Class<SwarmReplicatedJob>("SwarmReplicatedJob")(
    {
        MaxConcurrent: Schema.optional(
            Schema.NullOr(
                MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
            )
        ),
        TotalCompletions: Schema.optional(
            Schema.NullOr(
                MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
            )
        ),
    },
    {
        identifier: "SwarmReplicatedJob",
        title: "swarm.ReplicatedJob",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ReplicatedJob",
    }
) {}
