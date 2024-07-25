import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmIPAMOptions extends Schema.Class<SwarmIPAMOptions>("SwarmIPAMOptions")(
    {
        Driver: Schema.optionalWith(MobySchemasGenerated.SwarmDriver, { nullable: true }),
        Configs: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmIPAMConfig)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmIPAMOptions",
        title: "swarm.IPAMOptions",
    }
) {}
