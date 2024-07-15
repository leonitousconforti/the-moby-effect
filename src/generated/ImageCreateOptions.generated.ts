import * as Schema from "@effect/schema/Schema";

export class ImageCreateOptions extends Schema.Class<ImageCreateOptions>("ImageCreateOptions")(
    {
        RegistryAuth: Schema.NullOr(Schema.String),
        Platform: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ImageCreateOptions",
        title: "types.ImageCreateOptions",
    }
) {}
