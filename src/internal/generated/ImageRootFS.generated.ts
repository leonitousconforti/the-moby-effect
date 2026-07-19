import * as Schema from "effect/Schema";

export class ImageRootFS extends Schema.Class<ImageRootFS>("ImageRootFS")(
    {
        Type: Schema.optional(Schema.String),
        Layers: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "ImageRootFS",
        title: "image.RootFS",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#RootFS",
    }
) {}
