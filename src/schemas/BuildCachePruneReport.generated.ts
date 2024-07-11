import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class BuildCachePruneReport extends Schema.Class<BuildCachePruneReport>("BuildCachePruneReport")({
    CachesDeleted: Schema.Array(Schema.String),
    SpaceReclaimed: MobySchemas.UInt64,
}) {}
