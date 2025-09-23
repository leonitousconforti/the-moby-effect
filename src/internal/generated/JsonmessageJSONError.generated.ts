import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class JsonmessageJSONError extends Schema.Class<JsonmessageJSONError>("JsonmessageJSONError")(
    {
        code: Schema.optional(MobySchemas.Int64),
        message: Schema.optional(Schema.String),
    },
    {
        identifier: "JsonmessageJSONError",
        title: "jsonmessage.JSONError",
        documentation: "",
    }
) {}
