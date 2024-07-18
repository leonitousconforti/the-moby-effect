import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmEndpointSpec extends Schema.Class<SwarmEndpointSpec>("SwarmEndpointSpec")(
    {
        Mode: Schema.optional(Schema.String),
        Ports: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmPortConfig), { nullable: true }),
    },
    {
        identifier: "SwarmEndpointSpec",
        title: "swarm.EndpointSpec",
    }
) {}