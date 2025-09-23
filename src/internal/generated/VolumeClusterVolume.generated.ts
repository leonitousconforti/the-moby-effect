import * as Schema from "effect/Schema";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as VolumeClusterVolumeSpec from "./VolumeClusterVolumeSpec.generated.js";
import * as VolumeInfo from "./VolumeInfo.generated.js";
import * as VolumePublishStatus from "./VolumePublishStatus.generated.js";

export class VolumeClusterVolume extends Schema.Class<VolumeClusterVolume>("VolumeClusterVolume")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(VolumeClusterVolumeSpec.VolumeClusterVolumeSpec),
        PublishStatus: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumePublishStatus.VolumePublishStatus)), {
            nullable: true,
        }),
        Info: Schema.optionalWith(VolumeInfo.VolumeInfo, { nullable: true }),
    },
    {
        identifier: "VolumeClusterVolume",
        title: "volume.ClusterVolume",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#ClusterVolume",
    }
) {}
