import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ImageSearchOptions extends Schema.Class<ImageSearchOptions>("ImageSearchOptions")({
    RegistryAuth: Schema.String,
    Filters: MobySchemas.Args,
    Limit: MobySchemas.Int64,
}) {}
