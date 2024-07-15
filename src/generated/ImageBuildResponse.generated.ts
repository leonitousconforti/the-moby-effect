import * as Schema from "@effect/schema/Schema";

export class ImageBuildResponse extends Schema.Class<ImageBuildResponse>("ImageBuildResponse")(
    {
        Body: Schema.Object,
        OSType: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ImageBuildResponse",
        title: "types.ImageBuildResponse",
    }
) {}
