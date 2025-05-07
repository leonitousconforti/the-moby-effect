import * as Schema from "effect/Schema";

export class SwarmGlobalService extends Schema.Class<SwarmGlobalService>("SwarmGlobalService")(
    {},
    {
        identifier: "SwarmGlobalService",
        title: "swarm.GlobalService",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L83-L84",
    }
) {}
