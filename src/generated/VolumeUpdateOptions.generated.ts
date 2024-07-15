import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeUpdateOptions extends Schema.Class<VolumeUpdateOptions>("VolumeUpdateOptions")(
    {
        Spec: Schema.optional(MobySchemasGenerated.ClusterVolumeSpec, { nullable: true }),
    },
    {
        identifier: "VolumeUpdateOptions",
        title: "volume.UpdateOptions",
    }
) {}
