import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmPlacement extends Schema.Class<SwarmPlacement>("SwarmPlacement")(
    {
        Constraints: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Preferences: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPlacementPreference)), {
            nullable: true,
        }),
        MaxReplicas: Schema.optional(MobySchemas.UInt64),
        Platforms: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPlatform)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmPlacement",
        title: "swarm.Placement",
    }
) {}
