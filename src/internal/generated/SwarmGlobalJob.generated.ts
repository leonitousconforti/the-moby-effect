import * as Schema from "effect/Schema";

export class SwarmGlobalJob extends Schema.Class<SwarmGlobalJob>("SwarmGlobalJob")(
    {},
    {
        identifier: "SwarmGlobalJob",
        title: "swarm.GlobalJob",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#GlobalJob",
    }
) {}
