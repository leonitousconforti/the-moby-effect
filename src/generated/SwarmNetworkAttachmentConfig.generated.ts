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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L97-L102",
    }
) {}
