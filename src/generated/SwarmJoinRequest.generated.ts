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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L166-L174",
    }
) {}
