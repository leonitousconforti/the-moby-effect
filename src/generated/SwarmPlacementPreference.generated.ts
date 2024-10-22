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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L157-L161",
    }
) {}
