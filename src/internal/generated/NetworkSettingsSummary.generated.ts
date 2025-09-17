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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkSettingsSummary",
    }
) {}
