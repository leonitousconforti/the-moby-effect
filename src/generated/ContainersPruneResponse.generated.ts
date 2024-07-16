import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainersPruneResponse extends Schema.Class<ContainersPruneResponse>("ContainersPruneResponse")(
    {
        ContainersDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ContainersPruneResponse",
        title: "types.ContainersPruneReport",
    }
) {}
