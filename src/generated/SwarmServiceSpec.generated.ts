import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmServiceSpec extends Schema.Class<SwarmServiceSpec>("SwarmServiceSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        TaskTemplate: Schema.optional(MobySchemasGenerated.SwarmTaskSpec),
        Mode: Schema.optional(MobySchemasGenerated.SwarmServiceMode),
        UpdateConfig: Schema.optional(MobySchemasGenerated.SwarmUpdateConfig, { nullable: true }),
        RollbackConfig: Schema.optional(MobySchemasGenerated.SwarmUpdateConfig, { nullable: true }),
        Networks: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmNetworkAttachmentConfig), { nullable: true }),
        EndpointSpec: Schema.optional(MobySchemasGenerated.SwarmEndpointSpec, { nullable: true }),
    },
    {
        identifier: "SwarmServiceSpec",
        title: "swarm.ServiceSpec",
    }
) {}
