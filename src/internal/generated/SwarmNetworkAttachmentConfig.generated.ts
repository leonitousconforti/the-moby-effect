import * as Schema from "effect/Schema";

export class SwarmNetworkAttachmentConfig extends Schema.Class<SwarmNetworkAttachmentConfig>(
    "SwarmNetworkAttachmentConfig"
)(
    {
        Target: Schema.optional(Schema.String),
        Aliases: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        DriverOpts: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmNetworkAttachmentConfig",
        title: "swarm.NetworkAttachmentConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L97-L102",
    }
) {}
