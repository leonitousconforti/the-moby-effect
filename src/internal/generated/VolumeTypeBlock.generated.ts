import * as Schema from "effect/Schema";

// Intentionally empty.
export class VolumeTypeBlock extends Schema.Class<VolumeTypeBlock>("VolumeTypeBlock")(
    {},
    {
        identifier: "VolumeTypeBlock",
        title: "volume.TypeBlock",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L143-L146",
    }
) {}
