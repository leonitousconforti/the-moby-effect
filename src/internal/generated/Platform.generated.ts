import * as Schema from "effect/Schema";

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
        documentation: "",
    }
) {}
