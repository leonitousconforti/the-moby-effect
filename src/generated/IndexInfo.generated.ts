import * as Schema from "@effect/schema/Schema";

export class IndexInfo extends Schema.Class<IndexInfo>("IndexInfo")(
    {
        Name: Schema.String,
        Mirrors: Schema.Array(Schema.String),
        Secure: Schema.NullOr(Schema.Boolean),
        Official: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "IndexInfo",
        title: "registry.IndexInfo",
    }
) {}
