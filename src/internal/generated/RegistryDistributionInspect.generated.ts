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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#DistributionInspect",
    }
) {}
