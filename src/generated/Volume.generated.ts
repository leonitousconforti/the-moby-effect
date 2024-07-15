import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Volume extends Schema.Class<Volume>("Volume")(
    {
        /** Cluster volume. */
        ClusterVolume: Schema.optional(MobySchemasGenerated.ClusterVolume, { nullable: true }),

        /** Date/Time the volume was created. */
        CreatedAt: Schema.optional(Schema.String),

        /** Name of the volume driver used. */
        Driver: Schema.String,

        /** User-defined key/value metadata. */
        Labels: Schema.Record(Schema.String, Schema.String),

        /** Mount path of the volume on the host. */
        Mountpoint: Schema.String,

        /** Name of the volume. */
        Name: Schema.String,

        /** The driver specific options used when creating the volume. */
        Options: Schema.Record(Schema.String, Schema.String),

        /**
         * The level at which the volume exists. Either `global` for
         * cluster-wide, or `local` for machine level.
         */
        Scope: Schema.Literal("global", "local"),

        /** Low-level details about the volume, provided by the volume driver. */
        Status: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),

        /** Usage data. */
        UsageData: Schema.optional(MobySchemasGenerated.UsageData, { nullable: true }),
    },
    {
        identifier: "Volume",
        title: "volume.Volume",
    }
) {}
