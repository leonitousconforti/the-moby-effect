import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class IPAMOptions extends Schema.Class<IPAMOptions>("IPAMOptions")(
    {
        Driver: Schema.optional(MobySchemasGenerated.Driver),
        Configs: Schema.optional(Schema.Array(MobySchemasGenerated.IPAMConfig), { nullable: true }),
    },
    {
        identifier: "IPAMOptions",
        title: "swarm.IPAMOptions",
    }
) {}
