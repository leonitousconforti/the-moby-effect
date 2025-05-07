import * as Schema from "effect/Schema";
import * as SwarmClusterInfo from "./SwarmClusterInfo.generated.js";
import * as SwarmJoinTokens from "./SwarmJoinTokens.generated.js";

export class Swarm extends Schema.Class<Swarm>("Swarm")(
    {
        ...SwarmClusterInfo.SwarmClusterInfo.fields,
        JoinTokens: Schema.NullOr(SwarmJoinTokens.SwarmJoinTokens),
    },
    {
        identifier: "Swarm",
        title: "swarm.Swarm",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L20-L24",
    }
) {}
