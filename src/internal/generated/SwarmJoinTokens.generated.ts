import * as Schema from "effect/Schema";

export class SwarmJoinTokens extends Schema.Class<SwarmJoinTokens>("SwarmJoinTokens")(
    {
        Worker: Schema.String,
        Manager: Schema.String,
    },
    {
        identifier: "SwarmJoinTokens",
        title: "swarm.JoinTokens",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#JoinTokens",
    }
) {}
