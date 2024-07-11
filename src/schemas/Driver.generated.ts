import * as Schema from "@effect/schema/Schema";

export class Driver extends Schema.Class<Driver>("Driver")({
    Name: Schema.String,
    Options: Schema.Record(Schema.String, Schema.String),
}) {}
