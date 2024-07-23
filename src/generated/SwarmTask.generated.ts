import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTask extends Schema.Class<SwarmTask>("SwarmTask")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time, { nullable: true }),
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Spec: Schema.optional(MobySchemasGenerated.SwarmTaskSpec, { nullable: true }),
        ServiceID: Schema.optional(Schema.String),
        Slot: Schema.optional(MobySchemas.Int64),
        NodeID: Schema.optional(Schema.String),
        Status: Schema.optional(MobySchemasGenerated.SwarmTaskStatus, { nullable: true }),
        DesiredState: Schema.optional(Schema.String),
        NetworksAttachments: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNetworkAttachment)), {
            nullable: true,
        }),
        GenericResources: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmGenericResource)), {
            nullable: true,
        }),
        JobIteration: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmVolumeAttachment))),
    },
    {
        identifier: "SwarmTask",
        title: "swarm.Task",
    }
) {}
