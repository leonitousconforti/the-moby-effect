import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmService extends Schema.Class<SwarmService>("SwarmService")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: Schema.optional(MobySchemasGenerated.SwarmServiceSpec),
        PreviousSpec: Schema.optional(MobySchemasGenerated.SwarmServiceSpec, { nullable: true }),
        Endpoint: Schema.optional(MobySchemasGenerated.SwarmEndpoint),
        UpdateStatus: Schema.optional(MobySchemasGenerated.SwarmUpdateStatus, { nullable: true }),
        ServiceStatus: Schema.optional(MobySchemasGenerated.SwarmServiceStatus, { nullable: true }),
        JobStatus: Schema.optional(MobySchemasGenerated.SwarmJobStatus, { nullable: true }),
    },
    {
        identifier: "SwarmService",
        title: "swarm.Service",
    }
) {}
