import * as Schema from "@effect/schema/Schema";

export class IPAMConfig extends Schema.Class<IPAMConfig>("IPAMConfig")(
    {
        Subnet: Schema.optional(Schema.String, { nullable: true }),
        Range: Schema.optional(Schema.String, { nullable: true }),
        Gateway: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "IPAMConfig",
        title: "swarm.IPAMConfig",
    }
) {}
