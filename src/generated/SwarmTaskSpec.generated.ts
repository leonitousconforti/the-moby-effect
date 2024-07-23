import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTaskSpec extends Schema.Class<SwarmTaskSpec>("SwarmTaskSpec")(
    {
        ContainerSpec: Schema.optional(MobySchemasGenerated.SwarmContainerSpec, { nullable: true }),
        PluginSpec: Schema.optional(MobySchemasGenerated.PluginSpec, { nullable: true }),
        NetworkAttachmentSpec: Schema.optional(MobySchemasGenerated.SwarmNetworkAttachmentSpec, { nullable: true }),
        Resources: Schema.optional(MobySchemasGenerated.SwarmResourceRequirements, { nullable: true }),
        RestartPolicy: Schema.optional(MobySchemasGenerated.SwarmRestartPolicy, { nullable: true }),
        Placement: Schema.optional(MobySchemasGenerated.SwarmPlacement, { nullable: true }),
        Networks: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNetworkAttachmentConfig)), {
            nullable: true,
        }),
        LogDriver: Schema.optional(MobySchemasGenerated.SwarmDriver, { nullable: true }),
        ForceUpdate: MobySchemas.UInt64,
        Runtime: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmTaskSpec",
        title: "swarm.TaskSpec",
    }
) {}
