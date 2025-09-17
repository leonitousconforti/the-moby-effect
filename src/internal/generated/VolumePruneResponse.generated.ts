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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#PruneReport",
    }
) {}
