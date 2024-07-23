import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class VolumeInfo extends Schema.Class<VolumeInfo>("VolumeInfo")(
    {
        /**
         * CapacityBytes is the capacity of the volume in bytes. A value of 0
         * indicates that the capacity is unknown.
         */
        CapacityBytes: Schema.optional(MobySchemas.Int64),

        /**
         * VolumeContext is the context originating from the CSI storage plugin
         * when the Volume is created.
         */
        VolumeContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),

        /**
         * VolumeID is the ID of the Volume as seen by the CSI storage plugin.
         * This is distinct from the Volume's Swarm ID, which is the ID used by
         * all of the Docker Engine to refer to the Volume. If this field is
         * blank, then the Volume has not been successfully created yet.
         */
        VolumeID: Schema.optional(Schema.String),

        /**
         * AccessibleTopology is the topology this volume is actually accessible
         * from.
         */
        AccessibleTopology: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.VolumeTopology)), {
            nullable: true,
        }),
    },
    {
        identifier: "VolumeInfo",
        title: "volume.Info",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L400-L420",
    }
) {}
