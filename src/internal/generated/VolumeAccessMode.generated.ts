import * as Schema from "effect/Schema";
import * as VolumeTypeBlock from "./VolumeTypeBlock.generated.js";
import * as VolumeTypeMount from "./VolumeTypeMount.generated.js";

export class VolumeAccessMode extends Schema.Class<VolumeAccessMode>("VolumeAccessMode")(
    {
        Scope: Schema.optional(Schema.Literal("single", "multi")),
        Sharing: Schema.optional(Schema.Literal("none", "readonly", "onewriter", "all")),
        MountVolume: Schema.optionalWith(VolumeTypeMount.VolumeTypeMount, { nullable: true }),
        BlockVolume: Schema.optionalWith(VolumeTypeBlock.VolumeTypeBlock, { nullable: true }),
    },
    {
        identifier: "VolumeAccessMode",
        title: "volume.AccessMode",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#AccessMode",
    }
) {}
