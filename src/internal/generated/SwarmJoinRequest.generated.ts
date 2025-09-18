import * as Schema from "effect/Schema";

export class SwarmJoinRequest extends Schema.Class<SwarmJoinRequest>("SwarmJoinRequest")(
    {
        ListenAddr: Schema.String,
        AdvertiseAddr: Schema.String,
        DataPathAddr: Schema.String,
        RemoteAddrs: Schema.NullOr(Schema.Array(Schema.String)),
        JoinToken: Schema.String,
        Availability: Schema.Literal("active", "pause", "drain"),
    },
    {
        identifier: "SwarmJoinRequest",
        title: "swarm.JoinRequest",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#JoinRequest",
    }
) {}
