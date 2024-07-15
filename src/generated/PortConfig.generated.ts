import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PortConfig extends Schema.Class<PortConfig>("PortConfig")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Protocol: Schema.optional(Schema.String, { nullable: true }),
        TargetPort: Schema.optional(MobySchemas.UInt32, { nullable: true }),
        PublishedPort: Schema.optional(MobySchemas.UInt32, { nullable: true }),
        PublishMode: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "PortConfig",
        title: "swarm.PortConfig",
    }
) {}
