import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Volume extends Schema.Class<Volume>("Volume")({
    ClusterVolume: MobySchemas.ClusterVolume,
    CreatedAt: Schema.String,
    Driver: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    Mountpoint: Schema.String,
    Name: Schema.String,
    Options: Schema.Record(Schema.String, Schema.String),
    Scope: Schema.String,
    Status: Schema.Record(Schema.String, object),
    UsageData: MobySchemas.UsageData,
}) {}
