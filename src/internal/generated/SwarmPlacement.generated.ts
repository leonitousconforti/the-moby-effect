import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmPlacementPreference from "./SwarmPlacementPreference.generated.js";
import * as SwarmPlatform from "./SwarmPlatform.generated.js";

export class SwarmPlacement extends Schema.Class<SwarmPlacement>("SwarmPlacement")(
    {
        Constraints: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Preferences: Schema.optionalWith(
            Schema.Array(Schema.NullOr(SwarmPlacementPreference.SwarmPlacementPreference)),
            { nullable: true }
        ),
        MaxReplicas: Schema.optional(MobySchemas.UInt64),
        Platforms: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPlatform.SwarmPlatform)), { nullable: true }),
    },
    {
        identifier: "SwarmPlacement",
        title: "swarm.Placement",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Placement",
    }
) {}
