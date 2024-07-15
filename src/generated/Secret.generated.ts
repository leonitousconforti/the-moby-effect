import * as Schema from "@effect/schema/Schema";

export class Secret extends Schema.Class<Secret>("Secret")(
    {
        Key: Schema.NullOr(Schema.String),
        Secret: Schema.NullOr(Schema.String),
    },
    {
        identifier: "Secret",
        title: "volume.Secret",
    }
) {}
