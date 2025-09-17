import * as Schema from "effect/Schema";

export class ImageMetadata extends Schema.Class<ImageMetadata>("ImageMetadata")(
    {
        LastTagTime: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
    },
    {
        identifier: "ImageMetadata",
        title: "image.Metadata",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#Metadata",
    }
) {}
