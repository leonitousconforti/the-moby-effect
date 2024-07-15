import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PlacementPreference extends Schema.Class<PlacementPreference>("PlacementPreference")(
    {
        Spread: Schema.NullOr(MobySchemasGenerated.SpreadOver),
    },
    {
        identifier: "PlacementPreference",
        title: "swarm.PlacementPreference",
    }
) {}
