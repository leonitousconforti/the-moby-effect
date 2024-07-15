import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainersPruneReport extends Schema.Class<ContainersPruneReport>("ContainersPruneReport")(
    {
        ContainersDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "ContainersPruneReport",
        title: "types.ContainersPruneReport",
    }
) {}
