import * as Schema from "effect/Schema";
import * as SwarmSpreadOver from "./SwarmSpreadOver.generated.js";

export class SwarmPlacementPreference extends Schema.Class<SwarmPlacementPreference>("SwarmPlacementPreference")(
    {
        Spread: Schema.NullOr(SwarmSpreadOver.SwarmSpreadOver),
    },
    {
        identifier: "SwarmPlacementPreference",
        title: "swarm.PlacementPreference",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PlacementPreference",
    }
) {}
