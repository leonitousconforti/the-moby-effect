import * as Schema from "effect/Schema";
import * as NetworkEndpointSettings from "./NetworkEndpointSettings.generated.js";

export class NetworkSettingsSummary extends Schema.Class<NetworkSettingsSummary>("NetworkSettingsSummary")(
    {
        Networks: Schema.NullOr(
            Schema.Record({ key: Schema.String, value: Schema.NullOr(NetworkEndpointSettings.NetworkEndpointSettings) })
        ),
    },
    {
        identifier: "NetworkSettingsSummary",
        title: "container.NetworkSettingsSummary",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/network_settings.go#L52-L56",
    }
) {}
