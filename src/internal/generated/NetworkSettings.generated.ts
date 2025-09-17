import * as Schema from "effect/Schema";
import * as DefaultNetworkSettings from "./DefaultNetworkSettings.generated.js";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";
import * as NetworkSettingsBase from "./NetworkSettingsBase.generated.js";

export class NetworkSettings extends Schema.Class<NetworkSettings>("NetworkSettings")(
    {
        ...NetworkSettingsBase.NetworkSettingsBase.fields,
        ...DefaultNetworkSettings.DefaultNetworkSettings.fields,
        Networks: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings) })
        ),
    },
    {
        identifier: "NetworkSettings",
        title: "container.NetworkSettings",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkSettings",
    }
) {}
