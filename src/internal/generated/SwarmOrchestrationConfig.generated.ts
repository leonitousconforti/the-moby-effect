import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmOrchestrationConfig extends Schema.Class<SwarmOrchestrationConfig>("SwarmOrchestrationConfig")(
    {
        TaskHistoryRetentionLimit: Schema.optional(
            Schema.NullOr(
                MobyNumber.BigIntFromWireString.check(
                    Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
                )
            )
        ),
    },
    {
        identifier: "SwarmOrchestrationConfig",
        title: "swarm.OrchestrationConfig",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#OrchestrationConfig",
    }
) {}
