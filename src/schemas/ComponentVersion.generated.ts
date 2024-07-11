import * as Schema from "@effect/schema/Schema";

export class ComponentVersion extends Schema.Class<ComponentVersion>("ComponentVersion")({
    Name: Schema.String,
    Version: Schema.String,
    Details: Schema.Record(Schema.String, Schema.String),
}) {}
