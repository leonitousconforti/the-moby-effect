import * as Schema from "effect/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmEndpointSpec extends Schema.Class<SwarmEndpointSpec>("SwarmEndpointSpec")(
    {
        Mode: Schema.optional(
            Schema.Literal("vip", "dnsrr").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L20-L28",
            })
        ),
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), { nullable: true }),
    },
    {
        identifier: "SwarmEndpointSpec",
        title: "swarm.EndpointSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/network.go#L14-L18",
    }
) {}
