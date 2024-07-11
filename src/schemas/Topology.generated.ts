import * as Schema from "@effect/schema/Schema";

export class Topology extends Schema.Class<Topology>("Topology")({
    Segments: Schema.Record(Schema.String, Schema.String),
}) {}
