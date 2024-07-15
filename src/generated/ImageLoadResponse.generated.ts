import * as Schema from "@effect/schema/Schema";

export class ImageLoadResponse extends Schema.Class<ImageLoadResponse>("ImageLoadResponse")(
    {
        Body: Schema.Object,
        JSON: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ImageLoadResponse",
        title: "types.ImageLoadResponse",
    }
) {}
