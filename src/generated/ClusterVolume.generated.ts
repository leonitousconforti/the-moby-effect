import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ClusterVolume extends Schema.Class<ClusterVolume>("ClusterVolume")(
    {
        ID: Schema.String,
        Version: Schema.optional(MobySchemasGenerated.SwarmVersion),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: MobySchemasGenerated.ClusterVolumeSpec,
        PublishStatus: Schema.optional(Schema.Array(MobySchemasGenerated.VolumePublishStatus), { nullable: true }),
        Info: Schema.optional(MobySchemasGenerated.VolumeInfo, { nullable: true }),
    },
    {
        identifier: "ClusterVolume",
        title: "volume.ClusterVolume",
    }
) {}
