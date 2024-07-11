import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")({
    Containers: MobySchemas.Int64,
    Created: MobySchemas.Int64,
    ID: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    ParentID: Schema.String,
    RepoDigests: Schema.Array(Schema.String),
    RepoTags: Schema.Array(Schema.String),
    SharedSize: MobySchemas.Int64,
    Size: MobySchemas.Int64,
    VirtualSize: MobySchemas.Int64,
}) {}
