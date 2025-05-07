import * as Schema from "effect/Schema";

export class SwarmJoinRequest extends Schema.Class<SwarmJoinRequest>("SwarmJoinRequest")(
    {
        ListenAddr: Schema.String,
        AdvertiseAddr: Schema.String,
        DataPathAddr: Schema.String,
        RemoteAddrs: Schema.NullOr(Schema.Array(Schema.String)),
        JoinToken: Schema.String,
        Availability: Schema.Literal("active", "pause", "drain").annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L37-L47",
        }),
    },
    {
        identifier: "SwarmJoinRequest",
        title: "swarm.JoinRequest",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L166-L174",
    }
) {}
