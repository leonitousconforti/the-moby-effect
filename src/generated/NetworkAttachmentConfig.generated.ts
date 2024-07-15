import * as Schema from "@effect/schema/Schema";

export class NetworkAttachmentConfig extends Schema.Class<NetworkAttachmentConfig>("NetworkAttachmentConfig")(
    {
        Target: Schema.optional(Schema.String, { nullable: true }),
        Aliases: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        DriverOpts: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "NetworkAttachmentConfig",
        title: "swarm.NetworkAttachmentConfig",
    }
) {}
