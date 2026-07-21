import * as Schema from "effect/Schema";

import * as VolumeTypeBlock from "./VolumeTypeBlock.generated.ts";
import * as VolumeTypeMount from "./VolumeTypeMount.generated.ts";

export class VolumeAccessMode extends Schema.Class<VolumeAccessMode>("VolumeAccessMode")(
    {
        Scope: Schema.optional(Schema.Literals(["single", "multi"])),
        Sharing: Schema.optional(Schema.Literals(["none", "readonly", "onewriter", "all"])),
        MountVolume: Schema.optional(Schema.NullOr(VolumeTypeMount.VolumeTypeMount)),
        BlockVolume: Schema.optional(Schema.NullOr(VolumeTypeBlock.VolumeTypeBlock)),
    },
    {
        identifier: "VolumeAccessMode",
        title: "volume.AccessMode",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#AccessMode",
    }
) {}
