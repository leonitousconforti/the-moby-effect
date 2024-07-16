import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class VolumesPruneResponse extends Schema.Class<VolumesPruneResponse>("VolumesPruneResponse")(
    {
        VolumesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "VolumesPruneResponse",
        title: "types.VolumesPruneReport",
    }
) {}
