import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class JsonmessageJSONProgress extends Schema.Class<JsonmessageJSONProgress>("JsonmessageJSONProgress")(
    {
        current: Schema.optional(EffectSchemas.Number.I64),
        total: Schema.optional(EffectSchemas.Number.I64),
        start: Schema.optional(EffectSchemas.Number.I64),
        hidecounts: Schema.optional(Schema.Boolean),
        units: Schema.optional(Schema.String),
    },
    {
        identifier: "JsonmessageJSONProgress",
        title: "jsonmessage.JSONProgress",
        documentation: "",
    }
) {}
