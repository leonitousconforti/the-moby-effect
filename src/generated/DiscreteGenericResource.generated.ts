import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class DiscreteGenericResource extends Schema.Class<DiscreteGenericResource>("DiscreteGenericResource")(
    {
        Kind: Schema.optional(Schema.String, { nullable: true }),
        Value: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "DiscreteGenericResource",
        title: "swarm.DiscreteGenericResource",
    }
) {}
