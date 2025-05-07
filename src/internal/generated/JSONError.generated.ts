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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/pkg/jsonmessage/jsonmessage.go#L19-L24",
    }
) {}
