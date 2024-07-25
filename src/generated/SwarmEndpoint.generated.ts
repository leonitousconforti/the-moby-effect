import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmEndpoint extends Schema.Class<SwarmEndpoint>("SwarmEndpoint")(
    {
        Spec: Schema.optionalWith(MobySchemasGenerated.SwarmEndpointSpec, { nullable: true }),
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPortConfig)), {
            nullable: true,
        }),
        VirtualIPs: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmEndpointVirtualIP)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEndpoint",
        title: "swarm.Endpoint",
    }
) {}
