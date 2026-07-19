import * as Schema from "effect/Schema";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as VolumeClusterVolumeSpec from "./VolumeClusterVolumeSpec.generated.ts";
import * as VolumeInfo from "./VolumeInfo.generated.ts";
import * as VolumePublishStatus from "./VolumePublishStatus.generated.ts";

export class VolumeClusterVolume extends Schema.Class<VolumeClusterVolume>("VolumeClusterVolume")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(VolumeClusterVolumeSpec.VolumeClusterVolumeSpec),
        PublishStatus: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(VolumePublishStatus.VolumePublishStatus)))),
        Info: Schema.optional(Schema.NullOr(VolumeInfo.VolumeInfo)),
    },
    {
        identifier: "VolumeClusterVolume",
        title: "volume.ClusterVolume",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#ClusterVolume",
    }
) {}
