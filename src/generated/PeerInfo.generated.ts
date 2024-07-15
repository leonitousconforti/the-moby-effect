import * as Schema from "@effect/schema/Schema";

export class PeerInfo extends Schema.Class<PeerInfo>("PeerInfo")(
    {
        Name: Schema.NullOr(Schema.String),
        IP: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PeerInfo",
        title: "network.PeerInfo",
    }
) {}
