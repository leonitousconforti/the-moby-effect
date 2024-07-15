import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Volume extends Schema.Class<Volume>("Volume")(
    {
        ClusterVolume: Schema.optional(MobySchemasGenerated.ClusterVolume, { nullable: true }),
        CreatedAt: Schema.optional(Schema.String, { nullable: true }),
        Driver: Schema.NullOr(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Mountpoint: Schema.NullOr(Schema.String),
        Name: Schema.NullOr(Schema.String),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Scope: Schema.NullOr(Schema.String),
        Status: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),
        UsageData: Schema.optional(MobySchemasGenerated.UsageData, { nullable: true }),
    },
    {
        identifier: "Volume",
        title: "volume.Volume",
    }
) {}
