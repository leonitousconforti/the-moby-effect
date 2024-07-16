import * as Schema from "@effect/schema/Schema";

export class SwarmNetworkAttachmentConfig extends Schema.Class<SwarmNetworkAttachmentConfig>(
    "SwarmNetworkAttachmentConfig"
)(
    {
        Target: Schema.optional(Schema.String),
        Aliases: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        DriverOpts: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmNetworkAttachmentConfig",
        title: "swarm.NetworkAttachmentConfig",
    }
) {}
