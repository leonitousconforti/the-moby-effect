import * as Schema from "effect/Schema";

export class ContainerThrottlingData extends Schema.Class<ContainerThrottlingData>("ContainerThrottlingData")(
    {
        periods: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        throttled_periods: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        throttled_time: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    },
    {
        identifier: "ContainerThrottlingData",
        title: "container.ThrottlingData",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#ThrottlingData",
    }
) {}
