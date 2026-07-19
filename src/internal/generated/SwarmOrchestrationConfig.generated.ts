import * as Schema from "effect/Schema";

export class SwarmOrchestrationConfig extends Schema.Class<SwarmOrchestrationConfig>("SwarmOrchestrationConfig")(
    {
        TaskHistoryRetentionLimit: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })))),
    },
    {
        identifier: "SwarmOrchestrationConfig",
        title: "swarm.OrchestrationConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#OrchestrationConfig",
    }
) {}
