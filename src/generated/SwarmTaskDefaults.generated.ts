import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTaskDefaults extends Schema.Class<SwarmTaskDefaults>("SwarmTaskDefaults")(
    {
        LogDriver: Schema.optionalWith(MobySchemasGenerated.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmTaskDefaults",
        title: "swarm.TaskDefaults",
    }
) {}
