import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmPortConfig extends Schema.Class<SwarmPortConfig>("SwarmPortConfig")(
    {
        Name: Schema.optional(Schema.String),
        Protocol: Schema.optional(Schema.String),
        TargetPort: Schema.optional(MobySchemas.UInt32),
        PublishedPort: Schema.optional(MobySchemas.UInt32),
        PublishMode: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmPortConfig",
        title: "swarm.PortConfig",
    }
) {}
