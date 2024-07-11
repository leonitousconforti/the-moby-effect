import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>("ClusterVolumeSpec")({
    Group: Schema.String,
    AccessMode: MobySchemas.AccessMode,
    AccessibilityRequirements: MobySchemas.TopologyRequirement,
    CapacityRange: MobySchemas.CapacityRange,
    Secrets: Schema.Array(MobySchemas.Secret),
    Availability: Schema.String,
}) {}
