import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as ImageAttestationProperties from "./ImageAttestationProperties.generated.js";
import * as ImageImageProperties from "./ImageImageProperties.generated.js";
import * as V1Descriptor from "./V1Descriptor.generated.js";

export class ImageManifestSummary extends Schema.Class<ImageManifestSummary>("ImageManifestSummary")(
    {
        ID: Schema.String,
        Descriptor: Schema.NullOr(V1Descriptor.V1Descriptor),
        Available: Schema.Boolean,
        Size: Schema.Struct({
            Content: EffectSchemas.Number.I64,
            Total: EffectSchemas.Number.I64,
        }),
        Kind: Schema.Literal("image", "attestation", "unknown"),
        ImageData: Schema.optionalWith(ImageImageProperties.ImageImageProperties, { nullable: true }),
        AttestationData: Schema.optionalWith(ImageAttestationProperties.ImageAttestationProperties, { nullable: true }),
    },
    {
        identifier: "ImageManifestSummary",
        title: "image.ManifestSummary",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#ManifestSummary",
    }
) {}
