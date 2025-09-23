import * as Schema from "effect/Schema";
import * as ContainerDefaultNetworkSettings from "./ContainerDefaultNetworkSettings.generated.js";
import * as ContainerNetworkSettingsBase from "./ContainerNetworkSettingsBase.generated.js";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";

export class ContainerNetworkSettings extends Schema.Class<ContainerNetworkSettings>("ContainerNetworkSettings")(
    {
        ...ContainerNetworkSettingsBase.ContainerNetworkSettingsBase.fields,
        ...ContainerDefaultNetworkSettings.ContainerDefaultNetworkSettings.fields,
        Networks: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings) })
        ),
    },
    {
        identifier: "ContainerNetworkSettings",
        title: "container.NetworkSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkSettings",
    }
) {}
