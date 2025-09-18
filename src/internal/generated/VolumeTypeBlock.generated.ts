import * as Schema from "effect/Schema";

export class VolumeTypeBlock extends Schema.Class<VolumeTypeBlock>("VolumeTypeBlock")(
    {},
    {
        identifier: "VolumeTypeBlock",
        title: "volume.TypeBlock",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#TypeBlock",
    }
) {}
