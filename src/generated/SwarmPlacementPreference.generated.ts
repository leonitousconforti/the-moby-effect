import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmPlacementPreference extends Schema.Class<SwarmPlacementPreference>("SwarmPlacementPreference")(
    {
        Spread: Schema.NullOr(MobySchemasGenerated.SwarmSpreadOver),
    },
    {
        identifier: "SwarmPlacementPreference",
        title: "swarm.PlacementPreference",
    }
) {}
