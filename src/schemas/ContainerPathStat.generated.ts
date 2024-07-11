import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainerPathStat extends Schema.Class<ContainerPathStat>("ContainerPathStat")({
    Name: Schema.String,
    Size: MobySchemas.Int64,
    Mode: MobySchemas.UInt32,
    Mtime: MobySchemas.Time,
    LinkTarget: Schema.String,
}) {}
