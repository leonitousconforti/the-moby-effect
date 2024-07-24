import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmServiceMode extends Schema.Class<SwarmServiceMode>("SwarmServiceMode")(
    {
        Replicated: Schema.optionalWith(MobySchemasGenerated.SwarmReplicatedService, { nullable: true }),
        Global: Schema.optionalWith(MobySchemasGenerated.SwarmGlobalService, { nullable: true }),
        ReplicatedJob: Schema.optionalWith(MobySchemasGenerated.SwarmReplicatedJob, { nullable: true }),
        GlobalJob: Schema.optionalWith(MobySchemasGenerated.SwarmGlobalJob, { nullable: true }),
    },
    {
        identifier: "SwarmServiceMode",
        title: "swarm.ServiceMode",
    }
) {}
