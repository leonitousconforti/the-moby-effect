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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PruneReport",
    }
) {}
