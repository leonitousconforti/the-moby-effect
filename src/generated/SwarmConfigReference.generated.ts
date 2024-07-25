import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmConfigReference extends Schema.Class<SwarmConfigReference>("SwarmConfigReference")(
    {
        File: Schema.optionalWith(MobySchemasGenerated.SwarmConfigReferenceFileTarget, { nullable: true }),
        Runtime: Schema.optionalWith(MobySchemasGenerated.SwarmConfigReferenceRuntimeTarget, { nullable: true }),
        ConfigID: Schema.String,
        ConfigName: Schema.String,
    },
    {
        identifier: "SwarmConfigReference",
        title: "swarm.ConfigReference",
    }
) {}
