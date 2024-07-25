import * as Schema from "@effect/schema/Schema";

export class ImageLoadResponse extends Schema.Class<ImageLoadResponse>("ImageLoadResponse")(
    {
        Body: Schema.Object,
        JSON: Schema.Boolean,
    },
    {
        identifier: "ImageLoadResponse",
        title: "image.LoadResponse",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/image/image.go#L21-L47",
    }
) {}
