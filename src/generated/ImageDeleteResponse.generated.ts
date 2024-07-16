import * as Schema from "@effect/schema/Schema";

export class ImageDeleteResponse extends Schema.Class<ImageDeleteResponse>("ImageDeleteResponse")(
    {
        Deleted: Schema.optional(Schema.String),
        Untagged: Schema.optional(Schema.String),
    },
    {
        identifier: "ImageDeleteResponse",
        title: "types.ImageDeleteResponseItem",
    }
) {}
