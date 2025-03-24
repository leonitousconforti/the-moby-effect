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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L20-L24",
    }
) {}
