import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Task extends Schema.Class<Task>("Task")(
    {
        ID: Schema.NullOr(Schema.String),
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Spec: Schema.optional(MobySchemasGenerated.TaskSpec),
        ServiceID: Schema.optional(Schema.String, { nullable: true }),
        Slot: Schema.optional(MobySchemas.Int64, { nullable: true }),
        NodeID: Schema.optional(Schema.String, { nullable: true }),
        Status: Schema.optional(MobySchemasGenerated.TaskStatus),
        DesiredState: Schema.optional(Schema.String, { nullable: true }),
        NetworksAttachments: Schema.optional(Schema.Array(MobySchemasGenerated.NetworkAttachment), { nullable: true }),
        GenericResources: Schema.optional(Schema.Array(MobySchemasGenerated.GenericResource), { nullable: true }),
        JobIteration: Schema.optional(MobySchemasGenerated.Version, { nullable: true }),
        Volumes: Schema.NullOr(Schema.Array(MobySchemasGenerated.VolumeAttachment)),
    },
    {
        identifier: "Task",
        title: "swarm.Task",
    }
) {}
