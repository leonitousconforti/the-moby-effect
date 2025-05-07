import * as Schema from "effect/Schema";
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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/registry/registry.go#L113-L122",
    }
) {}
