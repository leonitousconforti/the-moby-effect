import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmPlacementPreference from "./SwarmPlacementPreference.generated.js";
import * as SwarmPlatform from "./SwarmPlatform.generated.js";

export class SwarmPlacement extends Schema.Class<SwarmPlacement>("SwarmPlacement")(
    {
        Constraints: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Preferences: Schema.optionalWith(
            Schema.Array(Schema.NullOr(SwarmPlacementPreference.SwarmPlacementPreference)),
            {
                nullable: true,
            }
        ),
        MaxReplicas: Schema.optional(MobySchemas.UInt64),
        Platforms: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPlatform.SwarmPlatform)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmPlacement",
        title: "swarm.Placement",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L145-L155",
    }
) {}
