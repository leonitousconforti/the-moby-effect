import * as Schema from "effect/Schema";

export class NetworkDisconnectOptions extends Schema.Class<NetworkDisconnectOptions>("NetworkDisconnectOptions")(
    {
        Container: Schema.String,
        Force: Schema.Boolean,
    },
    {
        identifier: "NetworkDisconnectOptions",
        title: "network.DisconnectOptions",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L65-L70",
    }
) {}
