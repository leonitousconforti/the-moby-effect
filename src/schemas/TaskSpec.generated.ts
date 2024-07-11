import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TaskSpec extends Schema.Class<TaskSpec>("TaskSpec")({
    ContainerSpec: MobySchemas.ContainerSpec,
    PluginSpec: MobySchemas.PluginSpec,
    NetworkAttachmentSpec: MobySchemas.NetworkAttachmentSpec,
    Resources: MobySchemas.ResourceRequirements,
    RestartPolicy: MobySchemas.RestartPolicy,
    Placement: MobySchemas.Placement,
    Networks: Schema.Array(MobySchemas.NetworkAttachmentConfig),
    LogDriver: MobySchemas.Driver,
    ForceUpdate: MobySchemas.UInt64,
    Runtime: Schema.String,
}) {}
