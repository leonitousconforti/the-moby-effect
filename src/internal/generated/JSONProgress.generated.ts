import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class JSONProgress extends Schema.Class<JSONProgress>("JSONProgress")(
    {
        current: Schema.optional(MobySchemas.Int64),
        total: Schema.optional(MobySchemas.Int64),
        start: Schema.optional(MobySchemas.Int64),
        hidecounts: Schema.optional(Schema.Boolean),
        units: Schema.optional(Schema.String),
    },
    {
        identifier: "JSONProgress",
        title: "jsonmessage.JSONProgress",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/pkg/jsonmessage/jsonmessage.go#L30-L52",
    }
) {}
