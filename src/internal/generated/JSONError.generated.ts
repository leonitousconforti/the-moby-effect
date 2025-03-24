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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/pkg/jsonmessage/jsonmessage.go#L19-L24",
    }
) {}
