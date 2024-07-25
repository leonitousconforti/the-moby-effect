import * as Schema from "@effect/schema/Schema";
import * as Time from "./Time.generated.js";

export class ImageMetadata extends Schema.Class<ImageMetadata>("ImageMetadata")(
    {
        LastTagTime: Schema.optionalWith(Time.Time, { nullable: true }),
    },
    {
        identifier: "ImageMetadata",
        title: "image.Metadata",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/image/image.go#L8-L12",
    }
) {}
