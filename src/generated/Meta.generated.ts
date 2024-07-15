import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Meta extends Schema.Class<Meta>("Meta")(
    {
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
    },
    {
        identifier: "Meta",
        title: "swarm.Meta",
    }
) {}
