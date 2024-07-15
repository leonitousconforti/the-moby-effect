import * as Schema from "@effect/schema/Schema";

export class ImageImportSource extends Schema.Class<ImageImportSource>("ImageImportSource")(
    {
        Source: Schema.Object,
        SourceName: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ImageImportSource",
        title: "types.ImageImportSource",
    }
) {}
