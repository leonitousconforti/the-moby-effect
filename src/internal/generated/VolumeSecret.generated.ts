import * as Schema from "effect/Schema";

export class VolumeSecret extends Schema.Class<VolumeSecret>("VolumeSecret")(
    {
        /**
         * Key is the name of the key of the key-value pair passed to the
         * plugin.
         */
        Key: Schema.String,

        /**
         * Secret is the swarm Secret object from which to read data. This can
         * be a Secret name or ID. The Secret data is retrieved by Swarm and
         * used as the value of the key-value pair passed to the plugin.
         */
        Secret: Schema.String,
    },
    {
        identifier: "VolumeSecret",
        title: "volume.Secret",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L349-L360",
    }
) {}
