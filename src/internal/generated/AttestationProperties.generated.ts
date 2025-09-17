import * as Schema from "effect/Schema";

export class AttestationProperties extends Schema.Class<AttestationProperties>("AttestationProperties")(
    {
        For: Schema.String,
    },
    {
        identifier: "AttestationProperties",
        title: "image.AttestationProperties",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#AttestationProperties",
    }
) {}
