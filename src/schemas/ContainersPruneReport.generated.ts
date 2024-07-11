import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ContainersPruneReport extends Schema.Class<ContainersPruneReport>("ContainersPruneReport")({
    ContainersDeleted: Schema.Array(Schema.String),
    SpaceReclaimed: MobySchemas.UInt64,
}) {}
