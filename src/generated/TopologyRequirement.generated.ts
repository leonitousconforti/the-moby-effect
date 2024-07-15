import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class TopologyRequirement extends Schema.Class<TopologyRequirement>("TopologyRequirement")(
    {
        Requisite: Schema.optional(Schema.Array(MobySchemasGenerated.Topology), { nullable: true }),
        Preferred: Schema.optional(Schema.Array(MobySchemasGenerated.Topology), { nullable: true }),
    },
    {
        identifier: "TopologyRequirement",
        title: "volume.TopologyRequirement",
    }
) {}
