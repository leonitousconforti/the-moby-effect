import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmEndpoint extends Schema.Class<SwarmEndpoint>("SwarmEndpoint")(
    {
        Spec: Schema.optional(MobySchemasGenerated.SwarmEndpointSpec, { nullable: true }),
        Ports: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPortConfig)), { nullable: true }),
        VirtualIPs: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmEndpointVirtualIP)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEndpoint",
        title: "swarm.Endpoint",
    }
) {}
