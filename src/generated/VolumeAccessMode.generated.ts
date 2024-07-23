import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeAccessMode extends Schema.Class<VolumeAccessMode>("VolumeAccessMode")(
    {
        /**
         * Scope defines the set of nodes this volume can be used on at one
         * time.
         */
        Scope: Schema.optional(Schema.Literal("single", "multi")),

        /**
         * Sharing defines the number and way that different tasks can use this
         * volume at one time.
         */
        Sharing: Schema.optional(Schema.Literal("none", "readonly", "onewriter", "all")),

        /** MountVolume defines options for using this volume as a Mount-type */
        MountVolume: Schema.optional(MobySchemasGenerated.VolumeTypeMount, { nullable: true }),

        /** BlockVolume defines options for using this volume as a Block-type */
        BlockVolume: Schema.optional(MobySchemasGenerated.VolumeTypeBlock, { nullable: true }),
    },
    {
        identifier: "VolumeAccessMode",
        title: "volume.AccessMode",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L85-L105",
    }
) {}
