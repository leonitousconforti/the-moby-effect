import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ServiceMode extends Schema.Class<ServiceMode>("ServiceMode")(
    {
        Replicated: Schema.optional(MobySchemasGenerated.ReplicatedService, { nullable: true }),
        Global: Schema.optional(MobySchemasGenerated.GlobalService, { nullable: true }),
        ReplicatedJob: Schema.optional(MobySchemasGenerated.ReplicatedJob, { nullable: true }),
        GlobalJob: Schema.optional(MobySchemasGenerated.GlobalJob, { nullable: true }),
    },
    {
        identifier: "ServiceMode",
        title: "swarm.ServiceMode",
    }
) {}
