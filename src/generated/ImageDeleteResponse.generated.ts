import * as Schema from "@effect/schema/Schema";

export class ImageDeleteResponse extends Schema.Class<ImageDeleteResponse>("ImageDeleteResponse")(
    {
        Deleted: Schema.optional(Schema.String),
        Untagged: Schema.optional(Schema.String),
    },
    {
        identifier: "ImageDeleteResponse",
        title: "image.DeleteResponse",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/image/delete_response.go#L6-L15",
    }
) {}
