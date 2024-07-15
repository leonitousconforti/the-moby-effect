import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class GenericResource extends Schema.Class<GenericResource>("GenericResource")(
    {
        NamedResourceSpec: Schema.optional(MobySchemasGenerated.NamedGenericResource, { nullable: true }),
        DiscreteResourceSpec: Schema.optional(MobySchemasGenerated.DiscreteGenericResource, { nullable: true }),
    },
    {
        identifier: "GenericResource",
        title: "swarm.GenericResource",
    }
) {}
