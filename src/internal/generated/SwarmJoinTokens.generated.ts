import * as Schema from "effect/Schema";

export class SwarmJoinTokens extends Schema.Class<SwarmJoinTokens>("SwarmJoinTokens")(
    {
        Worker: Schema.String,
        Manager: Schema.String,
    },
    {
        identifier: "SwarmJoinTokens",
        title: "swarm.JoinTokens",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L26-L32",
    }
) {}
