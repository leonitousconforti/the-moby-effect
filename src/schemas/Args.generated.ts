import * as Schema from "@effect/schema/Schema";

export class Args extends Schema.Class<Args>("Args")({
    fields: Schema.Record(Schema.String, Schema.Record(Schema.String, Schema.Boolean)),
}) {}
