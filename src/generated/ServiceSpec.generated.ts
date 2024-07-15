import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ServiceSpec extends Schema.Class<ServiceSpec>("ServiceSpec")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        TaskTemplate: Schema.optional(MobySchemasGenerated.TaskSpec),
        Mode: Schema.optional(MobySchemasGenerated.ServiceMode),
        UpdateConfig: Schema.optional(MobySchemasGenerated.UpdateConfig, { nullable: true }),
        RollbackConfig: Schema.optional(MobySchemasGenerated.UpdateConfig, { nullable: true }),
        Networks: Schema.optional(Schema.Array(MobySchemasGenerated.NetworkAttachmentConfig), { nullable: true }),
        EndpointSpec: Schema.optional(MobySchemasGenerated.EndpointSpec, { nullable: true }),
    },
    {
        identifier: "ServiceSpec",
        title: "swarm.ServiceSpec",
    }
) {}
