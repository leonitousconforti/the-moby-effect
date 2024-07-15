import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class EndpointSpec extends Schema.Class<EndpointSpec>("EndpointSpec")(
    {
        Mode: Schema.optional(Schema.String, { nullable: true }),
        Ports: Schema.optional(Schema.Array(MobySchemasGenerated.PortConfig), { nullable: true }),
    },
    {
        identifier: "EndpointSpec",
        title: "swarm.EndpointSpec",
    }
) {}
