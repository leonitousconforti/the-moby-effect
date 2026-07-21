import * as Schema from "effect/Schema";

import * as ImageAttestationProperties from "./ImageAttestationProperties.generated.ts";
import * as ImageImageProperties from "./ImageImageProperties.generated.ts";
import * as V1Descriptor from "./V1Descriptor.generated.ts";

export class ImageManifestSummary extends Schema.Class<ImageManifestSummary>("ImageManifestSummary")(
    {
        ID: Schema.String,
        Descriptor: Schema.NullOr(V1Descriptor.V1Descriptor),
        Available: Schema.Boolean,
        Size: Schema.Struct({
            Content: Schema.BigIntFromString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            ),
            Total: Schema.BigIntFromString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            ),
        }),
        Kind: Schema.Literals(["image", "attestation", "unknown"]),
        ImageData: Schema.optional(Schema.NullOr(ImageImageProperties.ImageImageProperties)),
        AttestationData: Schema.optional(Schema.NullOr(ImageAttestationProperties.ImageAttestationProperties)),
    },
    {
        identifier: "ImageManifestSummary",
        title: "image.ManifestSummary",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#ManifestSummary",
    }
) {}
