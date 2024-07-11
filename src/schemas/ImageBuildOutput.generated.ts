import * as Schema from "@effect/schema/Schema";

export class ImageBuildOutput extends Schema.Class<ImageBuildOutput>("ImageBuildOutput")({
    Type: Schema.String,
    Attrs: Schema.Record(Schema.String, Schema.String),
}) {}
