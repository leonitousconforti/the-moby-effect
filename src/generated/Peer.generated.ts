import * as Schema from "@effect/schema/Schema";

export class Peer extends Schema.Class<Peer>("Peer")(
    {
        NodeID: Schema.NullOr(Schema.String),
        Addr: Schema.NullOr(Schema.String),
    },
    {
        identifier: "Peer",
        title: "swarm.Peer",
    }
) {}
