import * as Schema from "@effect/schema/Schema";

export class NetworkDisconnect extends Schema.Class<NetworkDisconnect>("NetworkDisconnect")(
    {
        Container: Schema.NullOr(Schema.String),
        Force: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "NetworkDisconnect",
        title: "types.NetworkDisconnect",
    }
) {}
