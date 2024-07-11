import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class BuildCachePruneOptions extends Schema.Class<BuildCachePruneOptions>("BuildCachePruneOptions")({
    All: Schema.Boolean,
    KeepStorage: MobySchemas.Int64,
    Filters: MobySchemas.Args,
}) {}
