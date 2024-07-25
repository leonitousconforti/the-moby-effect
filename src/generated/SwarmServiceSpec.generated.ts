import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmServiceSpec extends Schema.Class<SwarmServiceSpec>("SwarmServiceSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        TaskTemplate: Schema.optionalWith(MobySchemasGenerated.SwarmTaskSpec, { nullable: true }),
        Mode: Schema.optionalWith(MobySchemasGenerated.SwarmServiceMode, { nullable: true }),
        UpdateConfig: Schema.optionalWith(MobySchemasGenerated.SwarmUpdateConfig, { nullable: true }),
        RollbackConfig: Schema.optionalWith(MobySchemasGenerated.SwarmUpdateConfig, { nullable: true }),
        Networks: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNetworkAttachmentConfig)), {
            nullable: true,
        }),
        EndpointSpec: Schema.optionalWith(MobySchemasGenerated.SwarmEndpointSpec, { nullable: true }),
    },
    {
        identifier: "SwarmServiceSpec",
        title: "swarm.ServiceSpec",
    }
) {}
