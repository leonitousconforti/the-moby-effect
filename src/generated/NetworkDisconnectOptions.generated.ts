import * as Schema from "@effect/schema/Schema";

export class NetworkDisconnectOptions extends Schema.Class<NetworkDisconnectOptions>("NetworkDisconnectOptions")(
    {
        Container: Schema.String,
        Force: Schema.Boolean,
    },
    {
        identifier: "NetworkDisconnectOptions",
        title: "network.DisconnectOptions",
    }
) {}
