import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmConfigReference extends Schema.Class<SwarmConfigReference>("SwarmConfigReference")(
    {
        File: Schema.optional(MobySchemasGenerated.SwarmConfigReferenceFileTarget, { nullable: true }),
        Runtime: Schema.optional(MobySchemasGenerated.SwarmConfigReferenceRuntimeTarget, { nullable: true }),
        ConfigID: Schema.String,
        ConfigName: Schema.String,
    },
    {
        identifier: "SwarmConfigReference",
        title: "swarm.ConfigReference",
    }
) {}
