import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumesPruneReport extends Schema.Class<VolumesPruneReport>("VolumesPruneReport")(
    {
        VolumesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "VolumesPruneReport",
        title: "types.VolumesPruneReport",
    }
) {}
