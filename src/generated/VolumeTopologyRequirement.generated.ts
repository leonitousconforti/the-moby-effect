import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeTopologyRequirement extends Schema.Class<VolumeTopologyRequirement>("VolumeTopologyRequirement")(
    {
        Requisite: Schema.optional(Schema.Array(MobySchemasGenerated.VolumeTopology), { nullable: true }),
        Preferred: Schema.optional(Schema.Array(MobySchemasGenerated.VolumeTopology), { nullable: true }),
    },
    {
        identifier: "VolumeTopologyRequirement",
        title: "volume.TopologyRequirement",
    }
) {}
