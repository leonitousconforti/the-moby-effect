import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ImageManifestSummary from "./ImageManifestSummary.generated.ts";
import * as V1Descriptor from "./V1Descriptor.generated.ts";

export class ImageSummary extends Schema.Class<ImageSummary>("ImageSummary")(
    {
        Containers: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Created: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Id: MobyIdentifiers.ImageIdentifier,
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        ParentId: Schema.String,
        Descriptor: Schema.optional(Schema.NullOr(V1Descriptor.V1Descriptor)),
        Manifests: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ImageManifestSummary.ImageManifestSummary)))),
        RepoDigests: Schema.NullOr(Schema.Array(MobyIdentifiers.Digest)),
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        SharedSize: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Size: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        VirtualSize: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
    },
    {
        identifier: "ImageSummary",
        title: "image.Summary",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#Summary",
    }
) {}
