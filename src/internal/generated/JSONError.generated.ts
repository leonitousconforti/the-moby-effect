import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class JSONError extends Schema.Class<JSONError>("JSONError")(
    {
        code: Schema.optional(MobySchemas.Int64),
        message: Schema.optional(Schema.String),
    },
    {
        identifier: "JSONError",
        title: "jsonmessage.JSONError",
        documentation: "",
    }
) {}
