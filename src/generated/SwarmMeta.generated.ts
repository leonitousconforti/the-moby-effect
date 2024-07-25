import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmMeta extends Schema.Class<SwarmMeta>("SwarmMeta")(
    {
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
    },
    {
        identifier: "SwarmMeta",
        title: "swarm.Meta",
    }
) {}
