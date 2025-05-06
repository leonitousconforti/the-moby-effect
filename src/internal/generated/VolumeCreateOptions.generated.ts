import * as Schema from "effect/Schema";
import * as ClusterVolumeSpec from "./ClusterVolumeSpec.generated.js";

export class VolumeCreateOptions extends Schema.Class<VolumeCreateOptions>("VolumeCreateOptions")(
    {
        /** Cluster volume spec */
        ClusterVolumeSpec: Schema.optionalWith(ClusterVolumeSpec.ClusterVolumeSpec, { nullable: true }),

        /** Name of the volume driver to use. */
        Driver: Schema.optional(Schema.String),

        /**
         * A mapping of driver options and values. These options are passed
         * directly to the driver and are driver specific.
         */
        DriverOpts: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),

        /** User-defined key/value metadata. */
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),

        /** The new volume's name. If not specified, Docker generates a name. */
        Name: Schema.optional(Schema.String),
    },
    {
        identifier: "VolumeCreateOptions",
        title: "volume.CreateOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/create_options.go#L6-L29",
    }
) {}
