import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PlacementPreference extends Schema.Class<PlacementPreference>("PlacementPreference")({
    Spread: MobySchemas.SpreadOver,
}) {}
