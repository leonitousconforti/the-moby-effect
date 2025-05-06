import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmPortConfig extends Schema.Class<SwarmPortConfig>("SwarmPortConfig")(
    {
        Name: Schema.optional(Schema.String),
        Protocol: Schema.optional(
            Schema.Literal("tcp", "udp", "sctp").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L55-L67",
            })
        ),
        TargetPort: Schema.optional(MobySchemas.UInt32),
        PublishedPort: Schema.optional(MobySchemas.UInt32),
        PublishMode: Schema.optional(
            Schema.Literal("ingress", "host").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L42-L53",
            })
        ),
    },
    {
        identifier: "SwarmPortConfig",
        title: "swarm.PortConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L30-L40",
    }
) {}
