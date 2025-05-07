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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/delete_response.go#L6-L15",
    }
) {}
