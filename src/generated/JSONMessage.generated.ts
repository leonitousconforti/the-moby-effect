import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class JSONMessage extends Schema.Class<JSONMessage>("JSONMessage")(
    {
        stream: Schema.optional(Schema.String),
        status: Schema.optional(Schema.String),
        progressDetail: Schema.optional(MobySchemasGenerated.JSONProgress, { nullable: true }),
        progress: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        time: Schema.optional(MobySchemas.Int64),
        timeNano: Schema.optional(MobySchemas.Int64),
        errorDetail: Schema.optional(MobySchemasGenerated.JSONError, { nullable: true }),
        error: Schema.optional(Schema.String),
        aux: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "JSONMessage",
        title: "jsonmessage.JSONMessage",
    }
) {}
