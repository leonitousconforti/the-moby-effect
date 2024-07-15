import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerPathStat extends Schema.Class<ContainerPathStat>("ContainerPathStat")(
    {
        name: Schema.NullOr(Schema.String),
        size: Schema.NullOr(MobySchemas.Int64),
        mode: Schema.NullOr(MobySchemas.UInt32),
        mtime: MobySchemasGenerated.Time,
        linkTarget: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ContainerPathStat",
        title: "types.ContainerPathStat",
    }
) {}
