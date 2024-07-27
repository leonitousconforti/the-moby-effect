import * as Schema from "@effect/schema/Schema";
import * as Descriptor from "./Descriptor.generated.js";
import * as Platform from "./Platform.generated.js";

export class RegistryDistributionInspect extends Schema.Class<RegistryDistributionInspect>(
    "RegistryDistributionInspect"
)(
    {
        Descriptor: Schema.NullOr(Descriptor.Descriptor),
        Platforms: Schema.NullOr(Schema.Array(Schema.NullOr(Platform.Platform))),
    },
    {
        identifier: "RegistryDistributionInspect",
        title: "registry.DistributionInspect",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/registry.go#L87-L96",
    }
) {}
