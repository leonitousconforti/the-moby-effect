import * as Schema from "@effect/schema/Schema";

export class LogConfig extends Schema.Class<LogConfig>("LogConfig")(
    {
        Type: Schema.NullOr(Schema.String),
        Config: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "LogConfig",
        title: "container.LogConfig",
    }
) {}
