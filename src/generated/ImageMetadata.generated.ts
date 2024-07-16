import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ImageMetadata extends Schema.Class<ImageMetadata>("ImageMetadata")(
    {
        LastTagTime: Schema.optional(MobySchemasGenerated.Time),
    },
    {
        identifier: "ImageMetadata",
        title: "types.ImageMetadata",
    }
) {}
