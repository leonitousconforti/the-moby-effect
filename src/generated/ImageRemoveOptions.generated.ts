import * as Schema from "@effect/schema/Schema";

export class ImageRemoveOptions extends Schema.Class<ImageRemoveOptions>("ImageRemoveOptions")(
    {
        Force: Schema.NullOr(Schema.Boolean),
        PruneChildren: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ImageRemoveOptions",
        title: "types.ImageRemoveOptions",
    }
) {}
