import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmIPAMOptions extends Schema.Class<SwarmIPAMOptions>("SwarmIPAMOptions")(
    {
        Driver: Schema.optional(MobySchemasGenerated.SwarmDriver),
        Configs: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmIPAMConfig), { nullable: true }),
    },
    {
        identifier: "SwarmIPAMOptions",
        title: "swarm.IPAMOptions",
    }
) {}
