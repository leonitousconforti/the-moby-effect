import * as Schema from "@effect/schema/Schema";

export class Platform extends Schema.Class<Platform>("Platform")(
    {
        Architecture: Schema.String,
        OS: Schema.String,
        OSVersion: Schema.String,
        OSFeatures: Schema.Array(Schema.String),
        Variant: Schema.String,
    },
    {
        identifier: "Platform",
        title: "v1.Platform",
    }
) {}
