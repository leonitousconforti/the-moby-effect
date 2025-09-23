import * as Schema from "effect/Schema";
import * as VolumeClusterVolume from "./VolumeClusterVolume.generated.js";
import * as VolumeUsageData from "./VolumeUsageData.generated.js";

export class VolumeVolume extends Schema.Class<VolumeVolume>("VolumeVolume")(
    {
        ClusterVolume: Schema.optionalWith(VolumeClusterVolume.VolumeClusterVolume, { nullable: true }),
        CreatedAt: Schema.optional(Schema.DateFromString),
        Driver: Schema.String,
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Mountpoint: Schema.String,
        Name: Schema.String,
        Options: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Scope: Schema.String,
        Status: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Object }), { nullable: true }),
        UsageData: Schema.optionalWith(VolumeUsageData.VolumeUsageData, { nullable: true }),
    },
    {
        identifier: "VolumeVolume",
        title: "volume.Volume",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Volume",
    }
) {}
