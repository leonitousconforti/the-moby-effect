import * as Schema from "effect/Schema";
import * as SwarmLimit from "./SwarmLimit.generated.js";
import * as SwarmResources from "./SwarmResources.generated.js";

export class SwarmResourceRequirements extends Schema.Class<SwarmResourceRequirements>("SwarmResourceRequirements")(
    {
        Limits: Schema.optionalWith(SwarmLimit.SwarmLimit, { nullable: true }),
        Reservations: Schema.optionalWith(SwarmResources.SwarmResources, { nullable: true }),
    },
    {
        identifier: "SwarmResourceRequirements",
        title: "swarm.ResourceRequirements",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L139-L143",
    }
) {}
