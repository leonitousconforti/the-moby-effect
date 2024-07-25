import * as Schema from "@effect/schema/Schema";

export class SwarmNetworkAttachmentConfig extends Schema.Class<SwarmNetworkAttachmentConfig>(
    "SwarmNetworkAttachmentConfig"
)(
    {
        Target: Schema.optional(Schema.String),
        Aliases: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        DriverOpts: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "SwarmNetworkAttachmentConfig",
        title: "swarm.NetworkAttachmentConfig",
    }
) {}
