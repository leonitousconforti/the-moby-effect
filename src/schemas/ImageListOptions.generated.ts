import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ImageListOptions extends Schema.Class<ImageListOptions>("ImageListOptions")({
    All: Schema.Boolean,
    Filters: MobySchemas.Args,
    SharedSize: Schema.Boolean,
    ContainerCount: Schema.Boolean,
}) {}
