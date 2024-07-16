import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmServiceMode extends Schema.Class<SwarmServiceMode>("SwarmServiceMode")(
    {
        Replicated: Schema.optional(MobySchemasGenerated.SwarmReplicatedService, { nullable: true }),
        Global: Schema.optional(MobySchemasGenerated.SwarmGlobalService, { nullable: true }),
        ReplicatedJob: Schema.optional(MobySchemasGenerated.SwarmReplicatedJob, { nullable: true }),
        GlobalJob: Schema.optional(MobySchemasGenerated.SwarmGlobalJob, { nullable: true }),
    },
    {
        identifier: "SwarmServiceMode",
        title: "swarm.ServiceMode",
    }
) {}
