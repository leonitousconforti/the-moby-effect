import * as Schema from "effect/Schema";

export class SwarmGlobalJob extends Schema.Class<SwarmGlobalJob>("SwarmGlobalJob")(
    {},
    {
        identifier: "SwarmGlobalJob",
        title: "swarm.GlobalJob",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L105-L110",
    }
) {}
