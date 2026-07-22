import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class JsonmessageJSONProgress extends Schema.Class<JsonmessageJSONProgress>("JsonmessageJSONProgress")(
    {
        current: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        total: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        start: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        hidecounts: Schema.optional(Schema.Boolean),
        units: Schema.optional(Schema.String),
    },
    {
        identifier: "JsonmessageJSONProgress",
        title: "jsonmessage.JSONProgress",
        documentation: "",
    }
) {}
