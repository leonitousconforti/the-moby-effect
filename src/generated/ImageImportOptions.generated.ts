import * as Schema from "@effect/schema/Schema";

export class ImageImportOptions extends Schema.Class<ImageImportOptions>("ImageImportOptions")(
    {
        Tag: Schema.NullOr(Schema.String),
        Message: Schema.NullOr(Schema.String),
        Changes: Schema.NullOr(Schema.Array(Schema.String)),
        Platform: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ImageImportOptions",
        title: "types.ImageImportOptions",
    }
) {}
