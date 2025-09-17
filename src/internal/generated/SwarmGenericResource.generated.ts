import * as Schema from "effect/Schema";
import * as SwarmDiscreteGenericResource from "./SwarmDiscreteGenericResource.generated.js";
import * as SwarmNamedGenericResource from "./SwarmNamedGenericResource.generated.js";

export class SwarmGenericResource extends Schema.Class<SwarmGenericResource>("SwarmGenericResource")(
    {
        NamedResourceSpec: Schema.optionalWith(SwarmNamedGenericResource.SwarmNamedGenericResource, { nullable: true }),
        DiscreteResourceSpec: Schema.optionalWith(SwarmDiscreteGenericResource.SwarmDiscreteGenericResource, {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmGenericResource",
        title: "swarm.GenericResource",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#GenericResource",
    }
) {}
