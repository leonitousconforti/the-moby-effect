import * as Schema from "effect/Schema";

export class SwarmLimit extends Schema.Class<SwarmLimit>("SwarmLimit")(
    {
        NanoCPUs: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        MemoryBytes: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        Pids: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
    },
    {
        identifier: "SwarmLimit",
        title: "swarm.Limit",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Limit",
    }
) {}
