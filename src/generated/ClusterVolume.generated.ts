import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ClusterVolume extends Schema.Class<ClusterVolume>("ClusterVolume")(
    {
        /**
         * ID is the Swarm ID of the volume. Because cluster volumes are Swarm
         * objects, they have an ID, unlike non-cluster volumes, which only have
         * a Name. This ID can be used to refer to the cluster volume.
         */
        ID: Schema.String,

        // Swarm metadata about this volume.
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),

        /** Cluster-specific options from which this volume is derived. */
        Spec: MobySchemasGenerated.ClusterVolumeSpec,

        /** Status of the volume as it pertains to its publishing on Nodes */
        PublishStatus: Schema.optional(Schema.Array(MobySchemasGenerated.PublishStatus), { nullable: true }),

        /** Information about the global status of the volume. */
        Info: Schema.optional(MobySchemasGenerated.Info, { nullable: true }),
    },
    {
        identifier: "ClusterVolume",
        title: "volume.ClusterVolume",
    }
) {}
