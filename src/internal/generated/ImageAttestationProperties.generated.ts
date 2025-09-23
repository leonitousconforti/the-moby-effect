import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImageAttestationProperties extends Schema.Class<ImageAttestationProperties>("ImageAttestationProperties")(
    {
        For: MobySchemas.Digest,
    },
    {
        identifier: "ImageAttestationProperties",
        title: "image.AttestationProperties",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#AttestationProperties",
    }
) {}
