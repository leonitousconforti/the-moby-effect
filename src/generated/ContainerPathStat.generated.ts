import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerPathStat extends Schema.Class<ContainerPathStat>("ContainerPathStat")(
    {
        name: Schema.String,
        size: MobySchemas.Int64,
        mode: MobySchemas.UInt32,
        mtime: MobySchemasGenerated.Time,
        linkTarget: Schema.String,
    },
    {
        identifier: "ContainerPathStat",
        title: "container.PathStat",
    }
) {}
