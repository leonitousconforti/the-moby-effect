import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerListOptions extends Schema.Class<ContainerListOptions>("ContainerListOptions")({
    Size: Schema.Boolean,
    All: Schema.Boolean,
    Latest: Schema.Boolean,
    Since: Schema.String,
    Before: Schema.String,
    Limit: MobySchemas.Int64,
    Filters: MobySchemas.Args,
}) {}
