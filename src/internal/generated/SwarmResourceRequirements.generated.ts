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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ResourceRequirements",
    }
) {}
