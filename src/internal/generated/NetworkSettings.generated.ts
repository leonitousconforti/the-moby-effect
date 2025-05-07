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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/network_settings.go#L9-L13",
    }
) {}
