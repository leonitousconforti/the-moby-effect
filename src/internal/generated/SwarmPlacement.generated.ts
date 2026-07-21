import * as Schema from "effect/Schema";

import * as SwarmPlacementPreference from "./SwarmPlacementPreference.generated.ts";
import * as SwarmPlatform from "./SwarmPlatform.generated.ts";

export class SwarmPlacement extends Schema.Class<SwarmPlacement>("SwarmPlacement")(
    {
        Constraints: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Preferences: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPlacementPreference.SwarmPlacementPreference)))
        ),
        MaxReplicas: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        Platforms: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPlatform.SwarmPlatform)))),
    },
    {
        identifier: "SwarmPlacement",
        title: "swarm.Placement",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Placement",
    }
) {}
