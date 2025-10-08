import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class JsonmessageJSONError extends Schema.Class<JsonmessageJSONError>("JsonmessageJSONError")(
    {
        code: Schema.optional(EffectSchemas.Number.I64),
        message: Schema.optional(Schema.String),
    },
    {
        identifier: "JsonmessageJSONError",
        title: "jsonmessage.JSONError",
        documentation: "",
    }
) {}
