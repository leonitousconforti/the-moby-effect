import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Task extends Schema.Class<Task>("Task")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Spec: MobySchemas.TaskSpec,
    ServiceID: Schema.String,
    Slot: MobySchemas.Int64,
    NodeID: Schema.String,
    Status: MobySchemas.TaskStatus,
    DesiredState: Schema.String,
    NetworksAttachments: Schema.Array(MobySchemas.NetworkAttachment),
    GenericResources: Schema.Array(MobySchemas.GenericResource),
    JobIteration: MobySchemas.Version,
    Volumes: Schema.Array(MobySchemas.VolumeAttachment),
}) {}
