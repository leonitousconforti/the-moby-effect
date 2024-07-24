import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmService extends Schema.Class<SwarmService>("SwarmService")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.optionalWith(MobySchemasGenerated.SwarmServiceSpec, { nullable: true }),
        PreviousSpec: Schema.optionalWith(MobySchemasGenerated.SwarmServiceSpec, { nullable: true }),
        Endpoint: Schema.optionalWith(MobySchemasGenerated.SwarmEndpoint, { nullable: true }),
        UpdateStatus: Schema.optionalWith(MobySchemasGenerated.SwarmUpdateStatus, { nullable: true }),
        ServiceStatus: Schema.optionalWith(MobySchemasGenerated.SwarmServiceStatus, { nullable: true }),
        JobStatus: Schema.optionalWith(MobySchemasGenerated.SwarmJobStatus, { nullable: true }),
    },
    {
        identifier: "SwarmService",
        title: "swarm.Service",
    }
) {}
