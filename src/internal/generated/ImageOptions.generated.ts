import * as Schema from "effect/Schema";

export class ImageOptions extends Schema.Class<ImageOptions>("ImageOptions")(
    {
        Subpath: Schema.optional(Schema.String),
    },
    {
        identifier: "ImageOptions",
        title: "mount.ImageOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L106-L108",
    }
) {}
