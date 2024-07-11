import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Placement extends Schema.Class<Placement>("Placement")({
    Constraints: Schema.Array(Schema.String),
    Preferences: Schema.Array(MobySchemas.PlacementPreference),
    MaxReplicas: MobySchemas.UInt64,
    Platforms: Schema.Array(MobySchemas.Platform),
}) {}
