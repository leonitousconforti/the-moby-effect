import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerPruneResponse extends Schema.Class<ContainerPruneResponse>("ContainerPruneResponse")(
    {
        ContainersDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerPruneResponse",
        title: "container.PruneReport",
    }
) {}
