import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class DistributionInspect extends Schema.Class<DistributionInspect>("DistributionInspect")({
    Descriptor: MobySchemas.Descriptor,
    Platforms: Schema.Array(MobySchemas.Platform),
}) {}
