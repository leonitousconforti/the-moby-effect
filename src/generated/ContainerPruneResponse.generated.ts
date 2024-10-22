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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/container.go#L9-L14",
    }
) {}
