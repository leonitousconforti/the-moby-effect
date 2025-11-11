import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as PortSchemas from "../schemas/port.ts";
import * as NetworkAddress from "./NetworkAddress.generated.js";

export class ContainerNetworkSettingsBase extends Schema.Class<ContainerNetworkSettingsBase>(
    "ContainerNetworkSettingsBase"
)(
    {
        Bridge: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        SandboxID: Schema.String,
        SandboxKey: Schema.String,
        Ports: Schema.NullOr(PortSchemas.PortMap),
        HairpinMode: Schema.Boolean,
        LinkLocalIPv6Address: Schema.String,
        LinkLocalIPv6PrefixLen: EffectSchemas.Number.I64,
        SecondaryIPAddresses: Schema.NullOr(Schema.Array(Schema.NullOr(NetworkAddress.NetworkAddress))),
        SecondaryIPv6Addresses: Schema.NullOr(Schema.Array(Schema.NullOr(NetworkAddress.NetworkAddress))),
    },
    {
        identifier: "ContainerNetworkSettingsBase",
        title: "container.NetworkSettingsBase",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkSettingsBase",
    }
) {}
