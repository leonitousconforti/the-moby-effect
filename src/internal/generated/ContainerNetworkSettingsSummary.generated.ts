import * as Schema from "effect/Schema";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.ts";

export class ContainerNetworkSettingsSummary extends Schema.Class<ContainerNetworkSettingsSummary>("ContainerNetworkSettingsSummary")(
    {
        Networks: Schema.NullOr(Schema.Record(Schema.String, Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings))),
    },
    {
        identifier: "ContainerNetworkSettingsSummary",
        title: "container.NetworkSettingsSummary",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkSettingsSummary",
    }
) {}
