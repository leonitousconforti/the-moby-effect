import * as Schema from "@effect/schema/Schema";

export class SwarmGlobalJob extends Schema.Class<SwarmGlobalJob>("SwarmGlobalJob")(
    {},
    {
        identifier: "SwarmGlobalJob",
        title: "swarm.GlobalJob",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L105-L110",
    }
) {}
