import * as Schema from "effect/Schema";
import * as VolumeTypeBlock from "./VolumeTypeBlock.generated.js";
import * as VolumeTypeMount from "./VolumeTypeMount.generated.js";

export class VolumeAccessMode extends Schema.Class<VolumeAccessMode>("VolumeAccessMode")(
    {
        /**
         * Scope defines the set of nodes this volume can be used on at one
         * time.
         */
        Scope: Schema.optional(
            Schema.Literal("single", "multi").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L107-L119",
            })
        ),

        /**
         * Sharing defines the number and way that different tasks can use this
         * volume at one time.
         */
        Sharing: Schema.optional(
            Schema.Literal("none", "readonly", "onewriter", "all").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L121-L141",
            })
        ),

        /** MountVolume defines options for using this volume as a Mount-type */
        MountVolume: Schema.optionalWith(VolumeTypeMount.VolumeTypeMount, { nullable: true }),

        /** BlockVolume defines options for using this volume as a Block-type */
        BlockVolume: Schema.optionalWith(VolumeTypeBlock.VolumeTypeBlock, { nullable: true }),
    },
    {
        identifier: "VolumeAccessMode",
        title: "volume.AccessMode",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L85-L105",
    }
) {}
