import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ImageManifestSummary from "./ImageManifestSummary.generated.js";
import * as V1Descriptor from "./V1Descriptor.generated.js";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")(
    {
        Containers: EffectSchemas.Number.I64,
        Created: EffectSchemas.Number.I64,
        Id: Schema.String,
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        ParentId: Schema.String,
        Descriptor: Schema.optionalWith(V1Descriptor.V1Descriptor, { nullable: true }),
        Manifests: Schema.optionalWith(Schema.Array(Schema.NullOr(ImageManifestSummary.ImageManifestSummary)), {
            nullable: true,
        }),
        RepoDigests: Schema.NullOr(Schema.Array(MobyIdentifiers.Digest)),
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        SharedSize: EffectSchemas.Number.I64,
        Size: EffectSchemas.Number.I64,
        VirtualSize: Schema.optional(EffectSchemas.Number.I64),
    },
    {
        identifier: "ImageSummary",
        title: "image.Summary",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#Summary",
    }
) {}
