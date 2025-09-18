import * as Schema from "effect/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmEndpointSpec extends Schema.Class<SwarmEndpointSpec>("SwarmEndpointSpec")(
    {
        Mode: Schema.optional(Schema.Literal("vip", "dnsrr")),
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), { nullable: true }),
    },
    {
        identifier: "SwarmEndpointSpec",
        title: "swarm.EndpointSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#EndpointSpec",
    }
) {}
