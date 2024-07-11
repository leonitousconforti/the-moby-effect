import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class DiscreteGenericResource extends Schema.Class<DiscreteGenericResource>("DiscreteGenericResource")({
    Kind: Schema.String,
    Value: MobySchemas.Int64,
}) {}
