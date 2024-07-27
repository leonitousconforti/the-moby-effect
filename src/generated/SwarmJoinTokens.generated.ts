import * as Schema from "@effect/schema/Schema";

export class SwarmJoinTokens extends Schema.Class<SwarmJoinTokens>("SwarmJoinTokens")(
    {
        Worker: Schema.String,
        Manager: Schema.String,
    },
    {
        identifier: "SwarmJoinTokens",
        title: "swarm.JoinTokens",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L26-L32",
    }
) {}
