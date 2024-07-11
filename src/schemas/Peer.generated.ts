import * as Schema from "@effect/schema/Schema";

export class Peer extends Schema.Class<Peer>("Peer")({
    NodeID: Schema.String,
    Addr: Schema.String,
}) {}
