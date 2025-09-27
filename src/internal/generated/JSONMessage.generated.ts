import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as JsonmessageJSONError from "./JsonmessageJSONError.generated.js";
import * as JsonmessageJSONProgress from "./JsonmessageJSONProgress.generated.js";

export class JSONMessage extends Schema.Class<JSONMessage>("JSONMessage")(
    {
        stream: Schema.optional(Schema.String),
        status: Schema.optional(Schema.String),
        progressDetail: Schema.optionalWith(JsonmessageJSONProgress.JsonmessageJSONProgress, { nullable: true }),
        progress: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        time: Schema.optional(MobySchemas.Int64),
        timeNano: Schema.optional(MobySchemas.Int64),
        errorDetail: Schema.optionalWith(JsonmessageJSONError.JsonmessageJSONError, { nullable: true }),
        error: Schema.optional(Schema.String),
        // aux: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "JSONMessage",
        title: "jsonmessage.JSONMessage",
        documentation: "",
    }
) {}
