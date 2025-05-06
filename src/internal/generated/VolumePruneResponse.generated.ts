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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/options.go#L10-L15",
    }
) {}
