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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L157-L161",
    }
) {}
