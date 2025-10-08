import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";

export class ImageAttestationProperties extends Schema.Class<ImageAttestationProperties>("ImageAttestationProperties")(
    {
        For: MobyIdentifiers.Digest,
    },
    {
        identifier: "ImageAttestationProperties",
        title: "image.AttestationProperties",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#AttestationProperties",
    }
) {}
