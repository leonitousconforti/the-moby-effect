import * as Schema from "@effect/schema/Schema";

export class ImageBuildOutput extends Schema.Class<ImageBuildOutput>("ImageBuildOutput")(
    {
        Type: Schema.NullOr(Schema.String),
        Attrs: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "ImageBuildOutput",
        title: "types.ImageBuildOutput",
    }
) {}
