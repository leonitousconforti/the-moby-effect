import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Service extends Schema.Class<Service>("Service")(
    {
        ID: Schema.NullOr(Schema.String),
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: Schema.optional(MobySchemasGenerated.ServiceSpec),
        PreviousSpec: Schema.optional(MobySchemasGenerated.ServiceSpec, { nullable: true }),
        Endpoint: Schema.optional(MobySchemasGenerated.Endpoint),
        UpdateStatus: Schema.optional(MobySchemasGenerated.UpdateStatus, { nullable: true }),
        ServiceStatus: Schema.optional(MobySchemasGenerated.ServiceStatus, { nullable: true }),
        JobStatus: Schema.optional(MobySchemasGenerated.JobStatus, { nullable: true }),
    },
    {
        identifier: "Service",
        title: "swarm.Service",
    }
) {}
