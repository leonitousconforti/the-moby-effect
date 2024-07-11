import * as Schema from "@effect/schema/Schema";

export class PeerInfo extends Schema.Class<PeerInfo>("PeerInfo")({
    Name: Schema.String,
    IP: Schema.String,
}) {}
