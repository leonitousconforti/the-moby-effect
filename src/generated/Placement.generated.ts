import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Placement extends Schema.Class<Placement>("Placement")(
    {
        Constraints: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Preferences: Schema.optional(Schema.Array(MobySchemasGenerated.PlacementPreference), { nullable: true }),
        MaxReplicas: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        Platforms: Schema.optional(Schema.Array(MobySchemasGenerated.Platform), { nullable: true }),
    },
    {
        identifier: "Placement",
        title: "swarm.Placement",
    }
) {}
