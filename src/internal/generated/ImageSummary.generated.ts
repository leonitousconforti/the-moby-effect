import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ImageManifestSummary from "./ImageManifestSummary.generated.js";
import * as V1Descriptor from "./V1Descriptor.generated.js";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")(
    {
        Containers: MobySchemas.Int64,
        Created: MobySchemas.Int64,
        Id: Schema.String,
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        ParentId: Schema.String,
        Descriptor: Schema.optionalWith(V1Descriptor.V1Descriptor, { nullable: true }),
        Manifests: Schema.optionalWith(Schema.Array(Schema.NullOr(ImageManifestSummary.ImageManifestSummary)), {
            nullable: true,
        }),
        RepoDigests: Schema.NullOr(Schema.Array(MobySchemas.Digest)),
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        SharedSize: MobySchemas.Int64,
        Size: MobySchemas.Int64,
        VirtualSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "ImageSummary",
        title: "image.Summary",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#Summary",
    }
) {}
