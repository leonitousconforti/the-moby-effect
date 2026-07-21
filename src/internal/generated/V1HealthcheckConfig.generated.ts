import * as Schema from "effect/Schema";

export class V1HealthcheckConfig extends Schema.Class<V1HealthcheckConfig>("V1HealthcheckConfig")(
    {
        Test: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Interval: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        Timeout: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        StartPeriod: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        StartInterval: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        Retries: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
    },
    {
        identifier: "V1HealthcheckConfig",
        title: "v1.HealthcheckConfig",
        documentation: "",
    }
) {}
