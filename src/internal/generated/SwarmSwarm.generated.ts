import * as Schema from "effect/Schema";
import * as SwarmClusterInfo from "./SwarmClusterInfo.generated.js";
import * as SwarmJoinTokens from "./SwarmJoinTokens.generated.js";

export class SwarmSwarm extends Schema.Class<SwarmSwarm>("SwarmSwarm")(
    {
        ...SwarmClusterInfo.SwarmClusterInfo.fields,
        JoinTokens: Schema.NullOr(SwarmJoinTokens.SwarmJoinTokens),
    },
    {
        identifier: "SwarmSwarm",
        title: "swarm.Swarm",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Swarm",
    }
) {}
