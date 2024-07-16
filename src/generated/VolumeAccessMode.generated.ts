import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeAccessMode extends Schema.Class<VolumeAccessMode>("VolumeAccessMode")(
    {
        Scope: Schema.optional(Schema.String),
        Sharing: Schema.optional(Schema.String),
        MountVolume: Schema.optional(MobySchemasGenerated.VolumeTypeMount, { nullable: true }),
        BlockVolume: Schema.optional(MobySchemasGenerated.VolumeTypeBlock, { nullable: true }),
    },
    {
        identifier: "VolumeAccessMode",
        title: "volume.AccessMode",
    }
) {}
