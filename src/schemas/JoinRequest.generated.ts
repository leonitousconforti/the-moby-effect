import * as Schema from "@effect/schema/Schema";

export class JoinRequest extends Schema.Class<JoinRequest>("JoinRequest")({
    ListenAddr: Schema.String,
    AdvertiseAddr: Schema.String,
    DataPathAddr: Schema.String,
    RemoteAddrs: Schema.Array(Schema.String),
    JoinToken: Schema.String,
    Availability: Schema.String,
}) {}
