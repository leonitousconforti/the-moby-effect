import * as Schema from "@effect/schema/Schema";

export class ImageDeleteResponseItem extends Schema.Class<ImageDeleteResponseItem>("ImageDeleteResponseItem")(
    {
        Deleted: Schema.optional(Schema.String, { nullable: true }),
        Untagged: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "ImageDeleteResponseItem",
        title: "types.ImageDeleteResponseItem",
    }
) {}
