import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmPortStatus extends Schema.Class<SwarmPortStatus>("SwarmPortStatus")(
    {
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPortConfig)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmPortStatus",
        title: "swarm.PortStatus",
    }
) {}
