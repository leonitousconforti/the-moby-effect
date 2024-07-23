import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Volume extends Schema.Class<Volume>("Volume")(
    {
        ClusterVolume: Schema.optional(MobySchemasGenerated.ClusterVolume, { nullable: true }),
        CreatedAt: Schema.optional(Schema.String),
        Driver: Schema.String,
        Labels: Schema.Record(Schema.String, Schema.String),
        Mountpoint: Schema.String,
        Name: Schema.String,
        Options: Schema.Record(Schema.String, Schema.String),
        Scope: Schema.String,
        Status: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),
        UsageData: Schema.optional(MobySchemasGenerated.VolumeUsageData, { nullable: true }),
    },
    {
        identifier: "Volume",
        title: "volume.Volume",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/volume.go#L6-L54",
    }
) {}
