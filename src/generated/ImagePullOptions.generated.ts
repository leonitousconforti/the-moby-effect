import * as Schema from "@effect/schema/Schema";

export class ImagePullOptions extends Schema.Class<ImagePullOptions>("ImagePullOptions")(
    {
        All: Schema.NullOr(Schema.Boolean),
        RegistryAuth: Schema.NullOr(Schema.String),
        Platform: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ImagePullOptions",
        title: "types.ImagePullOptions",
    }
) {}
