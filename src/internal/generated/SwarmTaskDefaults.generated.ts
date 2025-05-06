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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L53-L62",
    }
) {}
