import * as Schema from "effect/Schema";

export class ImageDeleteResponse extends Schema.Class<ImageDeleteResponse>("ImageDeleteResponse")(
    {
        Deleted: Schema.optional(Schema.String),
        Untagged: Schema.optional(Schema.String),
    },
    {
        identifier: "ImageDeleteResponse",
        title: "image.DeleteResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#DeleteResponse",
    }
) {}
