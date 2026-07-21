import * as Schema from "effect/Schema";

import * as SwarmLimit from "./SwarmLimit.generated.ts";
import * as SwarmResources from "./SwarmResources.generated.ts";

export class SwarmResourceRequirements extends Schema.Class<SwarmResourceRequirements>("SwarmResourceRequirements")(
    {
        Limits: Schema.optional(Schema.NullOr(SwarmLimit.SwarmLimit)),
        Reservations: Schema.optional(Schema.NullOr(SwarmResources.SwarmResources)),
    },
    {
        identifier: "SwarmResourceRequirements",
        title: "swarm.ResourceRequirements",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ResourceRequirements",
    }
) {}
