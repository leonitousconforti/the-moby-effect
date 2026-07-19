import * as Schema from "effect/Schema";

export class SwarmRestartPolicy extends Schema.Class<SwarmRestartPolicy>("SwarmRestartPolicy")(
    {
        Condition: Schema.optional(Schema.Literals(["none", "on-failure", "any"])),
        Delay: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })))),
        MaxAttempts: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })))),
        Window: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })))),
    },
    {
        identifier: "SwarmRestartPolicy",
        title: "swarm.RestartPolicy",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#RestartPolicy",
    }
) {}
