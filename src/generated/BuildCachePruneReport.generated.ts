import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BuildCachePruneReport extends Schema.Class<BuildCachePruneReport>("BuildCachePruneReport")(
    {
        CachesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "BuildCachePruneReport",
        title: "types.BuildCachePruneReport",
    }
) {}
