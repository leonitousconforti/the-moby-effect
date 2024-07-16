import * as Schema from "@effect/schema/Schema";

export class NetworkDisconnectRequest extends Schema.Class<NetworkDisconnectRequest>("NetworkDisconnectRequest")(
    {
        Container: Schema.String,
        Force: Schema.Boolean,
    },
    {
        identifier: "NetworkDisconnectRequest",
        title: "types.NetworkDisconnect",
    }
) {}
