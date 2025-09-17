import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Descriptor from "./Descriptor.generated.js";
import * as ManifestSummary from "./ManifestSummary.generated.js";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")(
    {
        Containers: MobySchemas.Int64,
        Created: MobySchemas.Int64,
        Id: Schema.String,
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        ParentId: Schema.String,
        Descriptor: Schema.optionalWith(Descriptor.Descriptor, { nullable: true }),
        Manifests: Schema.optionalWith(Schema.Array(Schema.NullOr(ManifestSummary.ManifestSummary)), {
            nullable: true,
        }),
        RepoDigests: Schema.NullOr(Schema.Array(Schema.String)),
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
