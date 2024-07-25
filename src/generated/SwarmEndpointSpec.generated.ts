import * as Schema from "@effect/schema/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmEndpointSpec extends Schema.Class<SwarmEndpointSpec>("SwarmEndpointSpec")(
    {
        Mode: Schema.optional(Schema.String),
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEndpointSpec",
        title: "swarm.EndpointSpec",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/network.go#L14-L18",
    }
) {}
