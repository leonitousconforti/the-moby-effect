import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ResourceRequirements extends Schema.Class<ResourceRequirements>("ResourceRequirements")({
    Limits: MobySchemas.Limit,
    Reservations: MobySchemas.Resources,
}) {}
