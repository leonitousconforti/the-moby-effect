import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as NetworkAddress from "./NetworkAddress.generated.js";

export class ContainerNetworkSettingsBase extends Schema.Class<ContainerNetworkSettingsBase>(
    "ContainerNetworkSettingsBase"
)(
    {
        Bridge: Schema.String,
        SandboxID: Schema.String,
        SandboxKey: Schema.String,
        Ports: Schema.NullOr(MobySchemas.PortMap),
        HairpinMode: Schema.Boolean,
        LinkLocalIPv6Address: Schema.String,
        LinkLocalIPv6PrefixLen: MobySchemas.Int64,
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
