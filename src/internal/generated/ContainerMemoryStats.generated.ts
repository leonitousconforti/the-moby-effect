import * as Schema from "effect/Schema";

export class ContainerMemoryStats extends Schema.Class<ContainerMemoryStats>("ContainerMemoryStats")(
    {
        usage: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
        max_usage: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
        stats: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))))),
        failcnt: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
        limit: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
        commitbytes: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
        commitpeakbytes: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
        privateworkingset: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))),
    },
    {
        identifier: "ContainerMemoryStats",
        title: "container.MemoryStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#MemoryStats",
    }
) {}
