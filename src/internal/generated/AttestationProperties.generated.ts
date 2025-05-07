import * as Schema from "effect/Schema";

export class AttestationProperties extends Schema.Class<AttestationProperties>("AttestationProperties")(
    {
        For: Schema.String,
    },
    {
        identifier: "AttestationProperties",
        title: "image.AttestationProperties",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/manifest.go#L96-L99",
    }
) {}
