import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmGenericResource extends Schema.Class<SwarmGenericResource>("SwarmGenericResource")(
    {
        NamedResourceSpec: Schema.optionalWith(MobySchemasGenerated.SwarmNamedGenericResource, { nullable: true }),
        DiscreteResourceSpec: Schema.optionalWith(MobySchemasGenerated.SwarmDiscreteGenericResource, {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmGenericResource",
        title: "swarm.GenericResource",
    }
) {}
