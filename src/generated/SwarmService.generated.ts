import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmService extends Schema.Class<SwarmService>("SwarmService")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.optional(MobySchemasGenerated.SwarmServiceSpec, { nullable: true }),
        PreviousSpec: Schema.optional(MobySchemasGenerated.SwarmServiceSpec, { nullable: true }),
        Endpoint: Schema.optional(MobySchemasGenerated.SwarmEndpoint, { nullable: true }),
        UpdateStatus: Schema.optional(MobySchemasGenerated.SwarmUpdateStatus, { nullable: true }),
        ServiceStatus: Schema.optional(MobySchemasGenerated.SwarmServiceStatus, { nullable: true }),
        JobStatus: Schema.optional(MobySchemasGenerated.SwarmJobStatus, { nullable: true }),
    },
    {
        identifier: "SwarmService",
        title: "swarm.Service",
    }
) {}
