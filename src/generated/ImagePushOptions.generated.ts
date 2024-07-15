import * as Schema from "@effect/schema/Schema";

export class ImagePushOptions extends Schema.Class<ImagePushOptions>("ImagePushOptions")(
    {
        All: Schema.NullOr(Schema.Boolean),
        RegistryAuth: Schema.NullOr(Schema.String),
        Platform: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ImagePushOptions",
        title: "types.ImagePushOptions",
    }
) {}
