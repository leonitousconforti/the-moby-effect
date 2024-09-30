import * as Schema from "@effect/schema/Schema";

export class ImageMetadata extends Schema.Class<ImageMetadata>("ImageMetadata")(
    {
        LastTagTime: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
    },
    {
        identifier: "ImageMetadata",
        title: "image.Metadata",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/image/image.go#L8-L12",
    }
) {}
