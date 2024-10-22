import * as Schema from "effect/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";

export class SwarmTaskDefaults extends Schema.Class<SwarmTaskDefaults>("SwarmTaskDefaults")(
    {
        LogDriver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmTaskDefaults",
        title: "swarm.TaskDefaults",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L53-L62",
    }
) {}
