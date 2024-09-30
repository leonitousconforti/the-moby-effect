import * as Schema from "@effect/schema/Schema";
import * as SwarmEndpointSpec from "./SwarmEndpointSpec.generated.js";
import * as SwarmEndpointVirtualIP from "./SwarmEndpointVirtualIP.generated.js";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmEndpoint extends Schema.Class<SwarmEndpoint>("SwarmEndpoint")(
    {
        Spec: Schema.optionalWith(SwarmEndpointSpec.SwarmEndpointSpec, { nullable: true }),
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), {
            nullable: true,
        }),
        VirtualIPs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmEndpointVirtualIP.SwarmEndpointVirtualIP)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEndpoint",
        title: "swarm.Endpoint",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L7-L12",
    }
) {}
