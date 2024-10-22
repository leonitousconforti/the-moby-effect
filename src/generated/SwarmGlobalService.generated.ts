import * as Schema from "effect/Schema";

export class SwarmGlobalService extends Schema.Class<SwarmGlobalService>("SwarmGlobalService")(
    {},
    {
        identifier: "SwarmGlobalService",
        title: "swarm.GlobalService",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L83-L84",
    }
) {}
