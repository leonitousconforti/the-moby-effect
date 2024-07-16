import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmGenericResource extends Schema.Class<SwarmGenericResource>("SwarmGenericResource")(
    {
        NamedResourceSpec: Schema.optional(MobySchemasGenerated.SwarmNamedGenericResource, { nullable: true }),
        DiscreteResourceSpec: Schema.optional(MobySchemasGenerated.SwarmDiscreteGenericResource, { nullable: true }),
    },
    {
        identifier: "SwarmGenericResource",
        title: "swarm.GenericResource",
    }
) {}
