import * as Schema from "@effect/schema/Schema";

export class GraphDriverData extends Schema.Class<GraphDriverData>("GraphDriverData")({
    Data: Schema.Record(Schema.String, Schema.String),
    Name: Schema.String,
}) {}
