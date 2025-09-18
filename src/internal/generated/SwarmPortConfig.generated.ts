import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmPortConfig extends Schema.Class<SwarmPortConfig>("SwarmPortConfig")(
    {
        Name: Schema.optional(Schema.String),
        Protocol: Schema.optional(Schema.Literal("tcp", "udp", "sctp")),
        TargetPort: Schema.optional(MobySchemas.UInt32),
        PublishedPort: Schema.optional(MobySchemas.UInt32),
        PublishMode: Schema.optional(Schema.Literal("ingress", "host")),
    },
    {
        identifier: "SwarmPortConfig",
        title: "swarm.PortConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PortConfig",
    }
) {}
