import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ClusterVolume extends Schema.Class<ClusterVolume>("ClusterVolume")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Spec: MobySchemas.ClusterVolumeSpec,
    PublishStatus: Schema.Array(MobySchemas.PublishStatus),
    Info: MobySchemas.Info,
}) {}
