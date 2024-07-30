import * as Schema from "@effect/schema/Schema";
import * as ClusterVolume from "./ClusterVolume.generated.js";
import * as VolumeUsageData from "./VolumeUsageData.generated.js";

export class Volume extends Schema.Class<Volume>("Volume")(
    {
        ClusterVolume: Schema.optionalWith(ClusterVolume.ClusterVolume, { nullable: true }),
        CreatedAt: Schema.optional(Schema.DateFromString),
        Driver: Schema.String,
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Mountpoint: Schema.String,
        Name: Schema.String,
        Options: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Scope: Schema.String,
        Status: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.Object,
            }),
            { nullable: true }
        ),
        UsageData: Schema.optionalWith(VolumeUsageData.VolumeUsageData, { nullable: true }),
    },
    {
        identifier: "Volume",
        title: "volume.Volume",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/volume.go#L6-L54",
    }
) {}
