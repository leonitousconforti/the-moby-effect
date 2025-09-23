import * as Schema from "effect/Schema";

export class MountImageOptions extends Schema.Class<MountImageOptions>("MountImageOptions")(
    {
        Subpath: Schema.optional(Schema.String),
    },
    {
        identifier: "MountImageOptions",
        title: "mount.ImageOptions",
        documentation: "",
    }
) {}
