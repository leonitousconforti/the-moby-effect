import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as VolumeClusterVolume from "./VolumeClusterVolume.generated.ts";
import * as VolumeUsageData from "./VolumeUsageData.generated.ts";

export class VolumeVolume extends Schema.Class<VolumeVolume>("VolumeVolume")(
    {
        ClusterVolume: Schema.optional(Schema.NullOr(VolumeClusterVolume.VolumeClusterVolume)),
        CreatedAt: Schema.optional(Schema.String),
        Driver: Schema.String,
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Mountpoint: Schema.String,
        Name: MobyIdentifiers.VolumeIdentifier,
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Scope: Schema.String,
        Status: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.ObjectKeyword))),
        UsageData: Schema.optional(Schema.NullOr(VolumeUsageData.VolumeUsageData)),
    },
    {
        identifier: "VolumeVolume",
        title: "volume.Volume",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Volume",
    }
) {}
