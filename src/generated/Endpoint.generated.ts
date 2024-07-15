import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Endpoint extends Schema.Class<Endpoint>("Endpoint")(
    {
        Spec: Schema.optional(MobySchemasGenerated.EndpointSpec),
        Ports: Schema.optional(Schema.Array(MobySchemasGenerated.PortConfig), { nullable: true }),
        VirtualIPs: Schema.optional(Schema.Array(MobySchemasGenerated.EndpointVirtualIP), { nullable: true }),
    },
    {
        identifier: "Endpoint",
        title: "swarm.Endpoint",
    }
) {}
