import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class VolumesPruneReport extends Schema.Class<VolumesPruneReport>("VolumesPruneReport")({
    VolumesDeleted: Schema.Array(Schema.String),
    SpaceReclaimed: MobySchemas.UInt64,
}) {}
