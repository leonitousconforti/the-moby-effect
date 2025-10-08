import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmPortConfig extends Schema.Class<SwarmPortConfig>("SwarmPortConfig")(
    {
        Name: Schema.optional(Schema.String),
        Protocol: Schema.optional(Schema.Literal("tcp", "udp", "sctp")),
        TargetPort: Schema.optional(EffectSchemas.Number.U32),
        PublishedPort: Schema.optional(EffectSchemas.Number.U32),
        PublishMode: Schema.optional(Schema.Literal("ingress", "host")),
    },
    {
        identifier: "SwarmPortConfig",
        title: "swarm.PortConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PortConfig",
    }
) {}
