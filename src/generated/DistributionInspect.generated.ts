import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class DistributionInspect extends Schema.Class<DistributionInspect>("DistributionInspect")(
    {
        Descriptor: MobySchemasGenerated.Descriptor,
        Platforms: Schema.NullOr(Schema.Array(MobySchemasGenerated.Platform)),
    },
    {
        identifier: "DistributionInspect",
        title: "registry.DistributionInspect",
    }
) {}
