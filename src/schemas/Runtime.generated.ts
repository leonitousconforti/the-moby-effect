import * as Schema from "@effect/schema/Schema";

export class Runtime extends Schema.Class<Runtime>("Runtime")({
    Path: Schema.String,
    Args: Schema.Array(Schema.String),
    Type: Schema.String,
    Options: Schema.Record(Schema.String, object),
}) {}
