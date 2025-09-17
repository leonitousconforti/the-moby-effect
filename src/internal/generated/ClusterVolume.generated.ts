import * as Schema from "effect/Schema";
import * as ClusterVolumeSpec from "./ClusterVolumeSpec.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as VolumeInfo from "./VolumeInfo.generated.js";
import * as VolumePublishStatus from "./VolumePublishStatus.generated.js";

export class ClusterVolume extends Schema.Class<ClusterVolume>("ClusterVolume")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(ClusterVolumeSpec.ClusterVolumeSpec),
        PublishStatus: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumePublishStatus.VolumePublishStatus)), {
            nullable: true,
        }),
        Info: Schema.optionalWith(VolumeInfo.VolumeInfo, { nullable: true }),
    },
    {
        identifier: "ClusterVolume",
        title: "volume.ClusterVolume",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#ClusterVolume",
    }
) {}
