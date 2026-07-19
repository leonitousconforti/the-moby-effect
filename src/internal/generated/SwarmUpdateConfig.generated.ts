import * as Schema from "effect/Schema";

export class SwarmUpdateConfig extends Schema.Class<SwarmUpdateConfig>("SwarmUpdateConfig")(
    {
        Parallelism: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        Delay: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        FailureAction: Schema.optional(Schema.String),
        Monitor: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        MaxFailureRatio: Schema.Number,
        Order: Schema.String,
    },
    {
        identifier: "SwarmUpdateConfig",
        title: "swarm.UpdateConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#UpdateConfig",
    }
) {}
