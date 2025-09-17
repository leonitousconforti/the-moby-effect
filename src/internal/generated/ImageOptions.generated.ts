import * as Schema from "effect/Schema";

export class ImageOptions extends Schema.Class<ImageOptions>("ImageOptions")(
    {
        Subpath: Schema.optional(Schema.String),
    },
    {
        identifier: "ImageOptions",
        title: "mount.ImageOptions",
        documentation: "",
    }
) {}
