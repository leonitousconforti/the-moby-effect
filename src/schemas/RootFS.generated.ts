import * as Schema from "@effect/schema/Schema";

export class RootFS extends Schema.Class<RootFS>("RootFS")({
    Type: Schema.String,
    Layers: Schema.Array(Schema.String),
}) {}
