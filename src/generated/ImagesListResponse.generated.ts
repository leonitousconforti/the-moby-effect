import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImagesListResponse extends Schema.Class<ImagesListResponse>("ImagesListResponse")(
    {
        Containers: MobySchemas.Int64,
        Created: MobySchemas.Int64,
        Id: Schema.String,
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        ParentId: Schema.String,
        RepoDigests: Schema.NullOr(Schema.Array(Schema.String)),
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        SharedSize: MobySchemas.Int64,
        Size: MobySchemas.Int64,
        VirtualSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "ImagesListResponse",
        title: "types.ImageSummary",
    }
) {}
