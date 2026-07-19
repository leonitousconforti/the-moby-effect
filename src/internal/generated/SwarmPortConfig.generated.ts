import * as Schema from "effect/Schema";

export class SwarmPortConfig extends Schema.Class<SwarmPortConfig>("SwarmPortConfig")(
    {
        Name: Schema.optional(Schema.String),
        Protocol: Schema.optional(Schema.Literals(["tcp", "udp", "sctp"])),
        TargetPort: Schema.optional(Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))),
        PublishedPort: Schema.optional(Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 }))),
        PublishMode: Schema.optional(Schema.Literals(["ingress", "host"])),
    },
    {
        identifier: "SwarmPortConfig",
        title: "swarm.PortConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PortConfig",
    }
) {}
