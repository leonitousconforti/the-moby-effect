import * as Schema from "@effect/schema/Schema";

export class VolumeSecret extends Schema.Class<VolumeSecret>("VolumeSecret")(
    {
        Key: Schema.String,
        Secret: Schema.String,
    },
    {
        identifier: "VolumeSecret",
        title: "volume.Secret",
    }
) {}
