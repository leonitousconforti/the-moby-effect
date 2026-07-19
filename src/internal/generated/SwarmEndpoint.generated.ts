import * as Schema from "effect/Schema";
import * as SwarmEndpointSpec from "./SwarmEndpointSpec.generated.ts";
import * as SwarmEndpointVirtualIP from "./SwarmEndpointVirtualIP.generated.ts";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.ts";

export class SwarmEndpoint extends Schema.Class<SwarmEndpoint>("SwarmEndpoint")(
    {
        Spec: Schema.optional(Schema.NullOr(SwarmEndpointSpec.SwarmEndpointSpec)),
        Ports: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)))),
        VirtualIPs: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmEndpointVirtualIP.SwarmEndpointVirtualIP)))),
    },
    {
        identifier: "SwarmEndpoint",
        title: "swarm.Endpoint",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Endpoint",
    }
) {}
