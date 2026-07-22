import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class V1HealthcheckConfig extends Schema.Class<V1HealthcheckConfig>("V1HealthcheckConfig")(
    {
        Test: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Interval: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        Timeout: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        StartPeriod: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        StartInterval: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        Retries: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
    },
    {
        identifier: "V1HealthcheckConfig",
        title: "v1.HealthcheckConfig",
        documentation: "",
    }
) {}
