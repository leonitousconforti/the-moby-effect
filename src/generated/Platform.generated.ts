import * as Schema from "@effect/schema/Schema";

export class Platform extends Schema.Class<Platform>("Platform")(
    {
        architecture: Schema.String,
        os: Schema.String,
        "os.version": Schema.optional(Schema.String),
        "os.features": Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        variant: Schema.optional(Schema.String),
    },
    {
        identifier: "Platform",
        title: "v1.Platform",
        documentation:
            "https://github.com/opencontainers/image-spec/blob/39ab2d54cfa8fe1bee1ff20001264986d92ab85a/specs-go/v1/descriptor.go#L52-L72",
    }
) {}
