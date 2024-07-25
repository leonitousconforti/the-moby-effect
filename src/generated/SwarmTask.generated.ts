import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmTask extends Schema.Class<SwarmTask>("SwarmTask")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Spec: Schema.optionalWith(MobySchemasGenerated.SwarmTaskSpec, { nullable: true }),
        ServiceID: Schema.optional(Schema.String),
        Slot: Schema.optional(MobySchemas.Int64),
        NodeID: Schema.optional(Schema.String),
        Status: Schema.optionalWith(MobySchemasGenerated.SwarmTaskStatus, { nullable: true }),
        DesiredState: Schema.optional(Schema.String),
        NetworksAttachments: Schema.optionalWith(
            Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNetworkAttachment)),
            {
                nullable: true,
            }
        ),
        GenericResources: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmGenericResource)), {
            nullable: true,
        }),
        JobIteration: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmVolumeAttachment))),
    },
    {
        identifier: "SwarmTask",
        title: "swarm.Task",
    }
) {}
