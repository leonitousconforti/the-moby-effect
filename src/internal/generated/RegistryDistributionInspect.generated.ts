import * as Schema from "effect/Schema";
import * as V1Descriptor from "./V1Descriptor.generated.js";
import * as V1Platform from "./V1Platform.generated.js";

export class RegistryDistributionInspect extends Schema.Class<RegistryDistributionInspect>(
    "RegistryDistributionInspect"
)(
    {
        Descriptor: Schema.NullOr(V1Descriptor.V1Descriptor),
        Platforms: Schema.NullOr(Schema.Array(Schema.NullOr(V1Platform.V1Platform))),
    },
    {
        identifier: "RegistryDistributionInspect",
        title: "registry.DistributionInspect",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#DistributionInspect",
    }
) {}
