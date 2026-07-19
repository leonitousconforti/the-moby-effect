import * as Schema from "effect/Schema";

export class SwarmNetworkAttachmentConfig extends Schema.Class<SwarmNetworkAttachmentConfig>("SwarmNetworkAttachmentConfig")(
    {
        Target: Schema.optional(Schema.String),
        Aliases: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        DriverOpts: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "SwarmNetworkAttachmentConfig",
        title: "swarm.NetworkAttachmentConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NetworkAttachmentConfig",
    }
) {}
