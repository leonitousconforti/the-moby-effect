import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class PortStatus extends Schema.Class<PortStatus>("PortStatus")(
    {
        Ports: Schema.optional(Schema.Array(MobySchemasGenerated.PortConfig), { nullable: true }),
    },
    {
        identifier: "PortStatus",
        title: "swarm.PortStatus",
    }
) {}
