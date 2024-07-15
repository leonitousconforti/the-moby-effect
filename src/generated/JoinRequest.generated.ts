import * as Schema from "@effect/schema/Schema";

export class JoinRequest extends Schema.Class<JoinRequest>("JoinRequest")(
    {
        ListenAddr: Schema.NullOr(Schema.String),
        AdvertiseAddr: Schema.NullOr(Schema.String),
        DataPathAddr: Schema.NullOr(Schema.String),
        RemoteAddrs: Schema.NullOr(Schema.Array(Schema.String)),
        JoinToken: Schema.NullOr(Schema.String),
        Availability: Schema.NullOr(Schema.String),
    },
    {
        identifier: "JoinRequest",
        title: "swarm.JoinRequest",
    }
) {}
