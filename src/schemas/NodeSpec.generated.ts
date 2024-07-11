import * as Schema from "@effect/schema/Schema";

export class NodeSpec extends Schema.Class<NodeSpec>("NodeSpec")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Role: Schema.String,
    Availability: Schema.String,
}) {}
