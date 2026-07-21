import * as Schema from "effect/Schema";

import * as ContainerDefaultNetworkSettings from "./ContainerDefaultNetworkSettings.generated.ts";
import * as ContainerNetworkSettingsBase from "./ContainerNetworkSettingsBase.generated.ts";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.ts";

export class ContainerNetworkSettings extends Schema.Class<ContainerNetworkSettings>("ContainerNetworkSettings")(
    {
        ...ContainerNetworkSettingsBase.ContainerNetworkSettingsBase.fields,
        ...ContainerDefaultNetworkSettings.ContainerDefaultNetworkSettings.fields,
        Networks: Schema.NullOr(
            Schema.Record(Schema.String, Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings))
        ),
    },
    {
        identifier: "ContainerNetworkSettings",
        title: "container.NetworkSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkSettings",
    }
) {}
