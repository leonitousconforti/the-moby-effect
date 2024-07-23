import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmConfig extends Schema.Class<SwarmConfig>("SwarmConfig")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.NullOr(MobySchemasGenerated.SwarmConfigSpec),
    },
    {
        identifier: "SwarmConfig",
        title: "swarm.Config",
    }
) {}
