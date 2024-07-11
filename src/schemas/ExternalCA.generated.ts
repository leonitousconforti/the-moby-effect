import * as Schema from "@effect/schema/Schema";

export class ExternalCA extends Schema.Class<ExternalCA>("ExternalCA")({
    Protocol: Schema.String,
    URL: Schema.String,
    Options: Schema.Record(Schema.String, Schema.String),
    CACert: Schema.String,
}) {}
