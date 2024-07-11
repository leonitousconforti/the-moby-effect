import * as Schema from "@effect/schema/Schema";

export class Annotations extends Schema.Class<Annotations>("Annotations")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
}) {}
