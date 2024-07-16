import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmConfig extends Schema.Class<SwarmConfig>("SwarmConfig")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: MobySchemasGenerated.SwarmConfigSpec,
    },
    {
        identifier: "SwarmConfig",
        title: "swarm.Config",
    }
) {}
