import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerDefaultNetworkSettings extends Schema.Class<ContainerDefaultNetworkSettings>(
    "ContainerDefaultNetworkSettings"
)(
    {
        EndpointID: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        Gateway: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        GlobalIPv6Address: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        GlobalIPv6PrefixLen: Schema.optional(EffectSchemas.Number.I64), // optional for docker.io/library/docker:26-dind-rootless
        IPAddress: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        IPPrefixLen: Schema.optional(EffectSchemas.Number.I64), // optional for docker.io/library/docker:26-dind-rootless
        IPv6Gateway: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        MacAddress: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
    },
    {
        identifier: "ContainerDefaultNetworkSettings",
        title: "container.DefaultNetworkSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#DefaultNetworkSettings",
    }
) {}
