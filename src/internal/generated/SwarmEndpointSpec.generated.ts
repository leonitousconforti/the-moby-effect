import * as Schema from "effect/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.ts";

export class SwarmEndpointSpec extends Schema.Class<SwarmEndpointSpec>("SwarmEndpointSpec")(
    {
        Mode: Schema.optional(Schema.Literals(["vip", "dnsrr"])),
        Ports: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)))),
    },
    {
        identifier: "SwarmEndpointSpec",
        title: "swarm.EndpointSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#EndpointSpec",
    }
) {}
