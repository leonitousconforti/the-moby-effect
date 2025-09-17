import * as Schema from "effect/Schema";

export class VolumeSecret extends Schema.Class<VolumeSecret>("VolumeSecret")(
    {
        Key: Schema.String,
        Secret: Schema.String,
    },
    {
        identifier: "VolumeSecret",
        title: "volume.Secret",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Secret",
    }
) {}
