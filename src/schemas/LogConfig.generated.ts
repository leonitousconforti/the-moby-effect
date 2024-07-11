import * as Schema from "@effect/schema/Schema";

export class LogConfig extends Schema.Class<LogConfig>("LogConfig")({
    Type: Schema.String,
    Config: Schema.Record(Schema.String, Schema.String),
}) {}
