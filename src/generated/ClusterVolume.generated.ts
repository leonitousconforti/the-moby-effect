import * as Schema from "@effect/schema/Schema";
import * as ClusterVolumeSpec from "./ClusterVolumeSpec.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as VolumeInfo from "./VolumeInfo.generated.js";
import * as VolumePublishStatus from "./VolumePublishStatus.generated.js";

export class ClusterVolume extends Schema.Class<ClusterVolume>("ClusterVolume")(
    {
        /**
         * ID is the Swarm ID of the volume. Because cluster volumes are Swarm
         * objects, they have an ID, unlike non-cluster volumes, which only have
         * a Name. This ID can be used to refer to the cluster volume.
         */
        ID: Schema.String,

        // https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/swarm/common.go#L18-L23
        ...SwarmMeta.SwarmMeta.fields,

        /**
         * Spec is the cluster-specific options from which this volume is
         * derived.
         */
        Spec: Schema.NullOr(ClusterVolumeSpec.ClusterVolumeSpec),

        /**
         * PublishStatus contains the status of the volume as it pertains to its
         * publishing on Nodes.
         */
        PublishStatus: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumePublishStatus.VolumePublishStatus)), {
            nullable: true,
        }),

        /** Info is information about the global status of the volume. */
        Info: Schema.optionalWith(VolumeInfo.VolumeInfo, { nullable: true }),
    },
    {
        identifier: "ClusterVolume",
        title: "volume.ClusterVolume",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L7-L27",
    }
) {}
