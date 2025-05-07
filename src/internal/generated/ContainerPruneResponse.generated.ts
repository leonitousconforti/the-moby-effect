import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerPruneResponse extends Schema.Class<ContainerPruneResponse>("ContainerPruneResponse")(
    {
        ContainersDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerPruneResponse",
        title: "container.PruneReport",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/container.go#L23-L28",
    }
) {}
