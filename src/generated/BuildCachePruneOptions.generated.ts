import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class BuildCachePruneOptions extends Schema.Class<BuildCachePruneOptions>("BuildCachePruneOptions")(
    {
        All: Schema.NullOr(Schema.Boolean),
        KeepStorage: Schema.NullOr(MobySchemas.Int64),
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "BuildCachePruneOptions",
        title: "types.BuildCachePruneOptions",
    }
) {}
