import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as JSONError from "./JSONError.generated.js";
import * as JSONProgress from "./JSONProgress.generated.js";

export class JSONMessage extends Schema.Class<JSONMessage>("JSONMessage")(
    {
        stream: Schema.optional(Schema.String),
        status: Schema.optional(Schema.String),
        progressDetail: Schema.optionalWith(JSONProgress.JSONProgress, { nullable: true }),
        progress: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        time: Schema.optional(MobySchemas.Int64),
        timeNano: Schema.optional(MobySchemas.Int64),
        errorDetail: Schema.optionalWith(JSONError.JSONError, { nullable: true }),
        error: Schema.optional(Schema.String),
        aux: Schema.optionalWith(Schema.Struct({ ID: Schema.String }), { nullable: true }),
    },
    {
        identifier: "JSONMessage",
        title: "jsonmessage.JSONMessage",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/pkg/jsonmessage/jsonmessage.go#L141-L165",
    }
) {}
