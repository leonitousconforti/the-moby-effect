import * as Schema from "effect/Schema";

export class JsonmessageJSONError extends Schema.Class<JsonmessageJSONError>("JsonmessageJSONError")(
    {
        code: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        message: Schema.optional(Schema.String),
    },
    {
        identifier: "JsonmessageJSONError",
        title: "jsonmessage.JSONError",
        documentation: "",
    }
) {}
