import * as Schema from "effect/Schema";

export class ImageMetadata extends Schema.Class<ImageMetadata>("ImageMetadata")(
    {
        LastTagTime: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
    },
    {
        identifier: "ImageMetadata",
        title: "image.Metadata",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/image.go#L8-L12",
    }
) {}
