import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumePruneResponse extends Schema.Class<VolumePruneResponse>("VolumePruneResponse")(
    {
        VolumesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "VolumePruneResponse",
        title: "volume.PruneReport",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/volume/options.go#L10-L15",
    }
) {}
