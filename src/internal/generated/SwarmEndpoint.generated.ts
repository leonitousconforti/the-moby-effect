import * as Schema from "effect/Schema";
import * as SwarmEndpointSpec from "./SwarmEndpointSpec.generated.js";
import * as SwarmEndpointVirtualIP from "./SwarmEndpointVirtualIP.generated.js";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmEndpoint extends Schema.Class<SwarmEndpoint>("SwarmEndpoint")(
    {
        Spec: Schema.optionalWith(SwarmEndpointSpec.SwarmEndpointSpec, { nullable: true }),
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), { nullable: true }),
        VirtualIPs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmEndpointVirtualIP.SwarmEndpointVirtualIP)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEndpoint",
        title: "swarm.Endpoint",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Endpoint",
    }
) {}
