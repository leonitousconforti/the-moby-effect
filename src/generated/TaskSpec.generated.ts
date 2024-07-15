import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class TaskSpec extends Schema.Class<TaskSpec>("TaskSpec")(
    {
        ContainerSpec: Schema.optional(MobySchemasGenerated.ContainerSpec, { nullable: true }),
        PluginSpec: Schema.optional(MobySchemasGenerated.PluginSpec, { nullable: true }),
        NetworkAttachmentSpec: Schema.optional(MobySchemasGenerated.NetworkAttachmentSpec, { nullable: true }),
        Resources: Schema.optional(MobySchemasGenerated.ResourceRequirements, { nullable: true }),
        RestartPolicy: Schema.optional(MobySchemasGenerated.RestartPolicy, { nullable: true }),
        Placement: Schema.optional(MobySchemasGenerated.Placement, { nullable: true }),
        Networks: Schema.optional(Schema.Array(MobySchemasGenerated.NetworkAttachmentConfig), { nullable: true }),
        LogDriver: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
        ForceUpdate: Schema.NullOr(MobySchemas.UInt64),
        Runtime: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "TaskSpec",
        title: "swarm.TaskSpec",
    }
) {}
