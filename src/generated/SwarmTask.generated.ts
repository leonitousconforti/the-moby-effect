import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTask extends Schema.Class<SwarmTask>("SwarmTask")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Spec: Schema.optional(MobySchemasGenerated.SwarmTaskSpec),
        ServiceID: Schema.optional(Schema.String),
        Slot: Schema.optional(MobySchemas.Int64),
        NodeID: Schema.optional(Schema.String),
        Status: Schema.optional(MobySchemasGenerated.SwarmTaskStatus),
        DesiredState: Schema.optional(Schema.String),
        NetworksAttachments: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmNetworkAttachment), {
            nullable: true,
        }),
        GenericResources: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmGenericResource), { nullable: true }),
        JobIteration: Schema.optional(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        Volumes: Schema.NullOr(Schema.Array(MobySchemasGenerated.SwarmVolumeAttachment)),
    },
    {
        identifier: "SwarmTask",
        title: "swarm.Task",
    }
) {}
