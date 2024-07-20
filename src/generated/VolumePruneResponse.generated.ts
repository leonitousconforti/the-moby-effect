import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumePruneResponse extends Schema.Class<VolumePruneResponse>("VolumePruneResponse")(
    {
        VolumesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "VolumePruneResponse",
        title: "volume.PruneReport",
    }
) {}
