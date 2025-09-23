import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class JsonmessageJSONProgress extends Schema.Class<JsonmessageJSONProgress>("JsonmessageJSONProgress")(
    {
        current: Schema.optional(MobySchemas.Int64),
        total: Schema.optional(MobySchemas.Int64),
        start: Schema.optional(MobySchemas.Int64),
        hidecounts: Schema.optional(Schema.Boolean),
        units: Schema.optional(Schema.String),
        terminalFd: Schema.Never,
        nowFunc: Schema.Never,
        winSize: MobySchemas.Int64,
    },
    {
        identifier: "JsonmessageJSONProgress",
        title: "jsonmessage.JSONProgress",
        documentation: "",
    }
) {}
