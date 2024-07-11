import * as Schema from "@effect/schema/Schema";

export class IndexInfo extends Schema.Class<IndexInfo>("IndexInfo")({
    Name: Schema.String,
    Mirrors: Schema.Array(Schema.String),
    Secure: Schema.Boolean,
    Official: Schema.Boolean,
}) {}
