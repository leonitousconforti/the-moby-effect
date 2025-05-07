import * as Schema from "effect/Schema";
import * as VolumeAccessMode from "./VolumeAccessMode.generated.js";
import * as VolumeCapacityRange from "./VolumeCapacityRange.generated.js";
import * as VolumeSecret from "./VolumeSecret.generated.js";
import * as VolumeTopologyRequirement from "./VolumeTopologyRequirement.generated.js";

export class ClusterVolumeSpec extends Schema.Class<ClusterVolumeSpec>("ClusterVolumeSpec")(
    {
        /**
         * Group defines the volume group of this volume. Volumes belonging to
         * the same group can be referred to by group name when creating
         * Services. Referring to a volume by group instructs swarm to treat
         * volumes in that group interchangeably for the purpose of scheduling.
         * Volumes with an empty string for a group technically all belong to
         * the same, empty string group.
         */
        Group: Schema.optional(Schema.String),

        /** AccessMode defines how the volume is used by tasks. */
        AccessMode: Schema.optionalWith(VolumeAccessMode.VolumeAccessMode, { nullable: true }),

        /**
         * AccessibilityRequirements specifies where in the cluster a volume
         * must be accessible from.
         *
         * This field must be empty if the plugin does not support
         * VOLUME_ACCESSIBILITY_CONSTRAINTS capabilities. If it is present but
         * the plugin does not support it, volume will not be created.
         *
         * If AccessibilityRequirements is empty, but the plugin does support
         * VOLUME_ACCESSIBILITY_CONSTRAINTS, then Swarm kit will assume the
         * entire cluster is a valid target for the volume.
         */
        AccessibilityRequirements: Schema.optionalWith(VolumeTopologyRequirement.VolumeTopologyRequirement, {
            nullable: true,
        }),

        /**
         * CapacityRange defines the desired capacity that the volume should be
         * created with. If nil, the plugin will decide the capacity.
         */
        CapacityRange: Schema.optionalWith(VolumeCapacityRange.VolumeCapacityRange, { nullable: true }),

        /**
         * Secrets defines Swarm Secrets that are passed to the CSI storage
         * plugin when operating on this volume.
         */
        Secrets: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumeSecret.VolumeSecret)), { nullable: true }),

        /**
         * Availability is the Volume's desired availability. Analogous to Node
         * Availability, this allows the user to take volumes offline in order
         * to update or delete them.
         */
        Availability: Schema.optional(
            Schema.Literal("active", "drain", "pause").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L68-L83",
            })
        ),
    },
    {
        identifier: "ClusterVolumeSpec",
        title: "volume.ClusterVolumeSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L29-L66",
    }
) {}
