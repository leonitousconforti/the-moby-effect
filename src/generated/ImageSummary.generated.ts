import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")(
    {
        Containers: MobySchemas.Int64,
        Created: MobySchemas.Int64,
        Id: Schema.String,
        Labels: Schema.Record(Schema.String, Schema.String),
        ParentId: Schema.String,
        RepoDigests: Schema.Array(Schema.String),
        RepoTags: Schema.Array(Schema.String),
        SharedSize: MobySchemas.Int64,
        Size: MobySchemas.Int64,
        VirtualSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "ImageSummary",
        title: "image.Summary",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/image/summary.go#L6-L89",
    }
) {}
