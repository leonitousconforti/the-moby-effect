import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTaskSpec extends Schema.Class<SwarmTaskSpec>("SwarmTaskSpec")(
    {
        ContainerSpec: Schema.optionalWith(MobySchemasGenerated.SwarmContainerSpec, { nullable: true }),
        PluginSpec: Schema.optionalWith(MobySchemasGenerated.PluginSpec, { nullable: true }),
        NetworkAttachmentSpec: Schema.optionalWith(MobySchemasGenerated.SwarmNetworkAttachmentSpec, { nullable: true }),
        Resources: Schema.optionalWith(MobySchemasGenerated.SwarmResourceRequirements, { nullable: true }),
        RestartPolicy: Schema.optionalWith(MobySchemasGenerated.SwarmRestartPolicy, { nullable: true }),
        Placement: Schema.optionalWith(MobySchemasGenerated.SwarmPlacement, { nullable: true }),
        Networks: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNetworkAttachmentConfig)), {
            nullable: true,
        }),
        LogDriver: Schema.optionalWith(MobySchemasGenerated.SwarmDriver, { nullable: true }),
        ForceUpdate: MobySchemas.UInt64,
        Runtime: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmTaskSpec",
        title: "swarm.TaskSpec",
    }
) {}
