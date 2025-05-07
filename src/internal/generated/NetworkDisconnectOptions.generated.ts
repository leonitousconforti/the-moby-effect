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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L66-L71",
    }
) {}
