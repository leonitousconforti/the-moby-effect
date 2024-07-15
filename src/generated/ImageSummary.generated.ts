import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")(
    {
        Containers: Schema.NullOr(MobySchemas.Int64),
        Created: Schema.NullOr(MobySchemas.Int64),
        Id: Schema.NullOr(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        ParentId: Schema.NullOr(Schema.String),
        RepoDigests: Schema.NullOr(Schema.Array(Schema.String)),
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        SharedSize: Schema.NullOr(MobySchemas.Int64),
        Size: Schema.NullOr(MobySchemas.Int64),
        VirtualSize: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ImageSummary",
        title: "types.ImageSummary",
    }
) {}
