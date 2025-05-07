import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Descriptor from "./Descriptor.generated.js";
import * as ImageProperties from "./ImageProperties.generated.js";
import * as AttestationProperties from "./AttestationProperties.generated.js";

export class ManifestSummary extends Schema.Class<ManifestSummary>("ManifestSummary")(
    {
        ID: Schema.String,
        Descriptor: Schema.NullOr(Descriptor.Descriptor),
        Available: Schema.Boolean,
        Size: Schema.Struct({
            Content: MobySchemas.Int64,
            Total: MobySchemas.Int64,
        }),
        Kind: Schema.Literal("image", "attestation", "unknown").annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/manifest.go#L8-L14",
        }),
        ImageData: Schema.optionalWith(ImageProperties.ImageProperties, { nullable: true }),
        AttestationData: Schema.optionalWith(AttestationProperties.AttestationProperties, { nullable: true }),
    },
    {
        identifier: "ManifestSummary",
        title: "image.ManifestSummary",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/manifest.go#L16-L68",
    }
) {}
