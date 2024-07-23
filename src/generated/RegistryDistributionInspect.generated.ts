import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class RegistryDistributionInspect extends Schema.Class<RegistryDistributionInspect>(
    "RegistryDistributionInspect"
)(
    {
        Descriptor: Schema.NullOr(MobySchemasGenerated.Descriptor),
        Platforms: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.Platform))),
    },
    {
        identifier: "RegistryDistributionInspect",
        title: "registry.DistributionInspect",
    }
) {}
