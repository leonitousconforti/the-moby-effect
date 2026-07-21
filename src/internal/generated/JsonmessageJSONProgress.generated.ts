import * as Schema from "effect/Schema";

export class JsonmessageJSONProgress extends Schema.Class<JsonmessageJSONProgress>("JsonmessageJSONProgress")(
    {
        current: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        total: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        start: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
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
