import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class GenericResource extends Schema.Class<GenericResource>("GenericResource")({
    NamedResourceSpec: MobySchemas.NamedGenericResource,
    DiscreteResourceSpec: MobySchemas.DiscreteGenericResource,
}) {}
