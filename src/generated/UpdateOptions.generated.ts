import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class UpdateOptions extends Schema.Class<UpdateOptions>("UpdateOptions")(
    {
        Spec: Schema.optional(MobySchemasGenerated.ClusterVolumeSpec, { nullable: true }),
    },
    {
        identifier: "UpdateOptions",
        title: "volume.UpdateOptions",
    }
) {}
