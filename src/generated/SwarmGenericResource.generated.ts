import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L114-L119",
    }
) {}
