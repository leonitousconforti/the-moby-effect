import * as Schema from "effect/Schema";

// Intentionally empty.
export class VolumeTypeBlock extends Schema.Class<VolumeTypeBlock>("VolumeTypeBlock")(
    {},
    {
        identifier: "VolumeTypeBlock",
        title: "volume.TypeBlock",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/cluster_volume.go#L143-L146",
    }
) {}
