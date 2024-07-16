import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmMeta extends Schema.Class<SwarmMeta>("SwarmMeta")(
    {
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
    },
    {
        identifier: "SwarmMeta",
        title: "swarm.Meta",
    }
) {}
