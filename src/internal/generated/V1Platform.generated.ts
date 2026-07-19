import * as Schema from "effect/Schema";

export class V1Platform extends Schema.Class<V1Platform>("V1Platform")(
    {
        architecture: Schema.String,
        os: Schema.String,
        "os.version": Schema.optional(Schema.String),
        "os.features": Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        variant: Schema.optional(Schema.String),
    },
    {
        identifier: "V1Platform",
        title: "v1.Platform",
        documentation: "",
    }
) {}
