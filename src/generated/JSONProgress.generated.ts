import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class JSONProgress extends Schema.Class<JSONProgress>("JSONProgress")(
    {
        current: Schema.optional(MobySchemas.Int64),
        total: Schema.optional(MobySchemas.Int64),
        start: Schema.optional(MobySchemas.Int64),
        hidecounts: Schema.optional(Schema.Boolean),
        units: Schema.optional(Schema.String),
        winSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "JSONProgress",
        title: "jsonmessage.JSONProgress",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/pkg/jsonmessage/jsonmessage.go#L30-L52",
    }
) {}
