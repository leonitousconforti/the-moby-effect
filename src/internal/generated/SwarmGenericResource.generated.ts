import * as Schema from "effect/Schema";

import * as SwarmDiscreteGenericResource from "./SwarmDiscreteGenericResource.generated.ts";
import * as SwarmNamedGenericResource from "./SwarmNamedGenericResource.generated.ts";

export class SwarmGenericResource extends Schema.Class<SwarmGenericResource>("SwarmGenericResource")(
    {
        NamedResourceSpec: Schema.optional(Schema.NullOr(SwarmNamedGenericResource.SwarmNamedGenericResource)),
        DiscreteResourceSpec: Schema.optional(Schema.NullOr(SwarmDiscreteGenericResource.SwarmDiscreteGenericResource)),
    },
    {
        identifier: "SwarmGenericResource",
        title: "swarm.GenericResource",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#GenericResource",
    }
) {}
