import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ImageListOptions extends Schema.Class<ImageListOptions>("ImageListOptions")(
    {
        All: Schema.NullOr(Schema.Boolean),
        Filters: MobySchemasGenerated.Args,
        SharedSize: Schema.NullOr(Schema.Boolean),
        ContainerCount: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ImageListOptions",
        title: "types.ImageListOptions",
    }
) {}
