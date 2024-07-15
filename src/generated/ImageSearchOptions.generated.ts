import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ImageSearchOptions extends Schema.Class<ImageSearchOptions>("ImageSearchOptions")(
    {
        RegistryAuth: Schema.NullOr(Schema.String),
        Filters: MobySchemasGenerated.Args,
        Limit: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "ImageSearchOptions",
        title: "types.ImageSearchOptions",
    }
) {}
