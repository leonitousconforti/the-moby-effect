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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L114-L119",
    }
) {}
