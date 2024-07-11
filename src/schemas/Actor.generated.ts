import * as Schema from "@effect/schema/Schema";

export class Actor extends Schema.Class<Actor>("Actor")({
    ID: Schema.String,
    Attributes: Schema.Record(Schema.String, Schema.String),
}) {}
