import * as Schema from "@effect/schema/Schema";

export class SwarmJoinRequest extends Schema.Class<SwarmJoinRequest>("SwarmJoinRequest")(
    {
        ListenAddr: Schema.String,
        AdvertiseAddr: Schema.String,
        DataPathAddr: Schema.String,
        RemoteAddrs: Schema.NullOr(Schema.Array(Schema.String)),
        JoinToken: Schema.String,
        Availability: Schema.String,
    },
    {
        identifier: "SwarmJoinRequest",
        title: "swarm.JoinRequest",
    }
) {}
