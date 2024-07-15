import * as Schema from "@effect/schema/Schema";

export class Args extends Schema.Class<Args>("Args")(
    {
        fields: Schema.NullOr(Schema.Record(Schema.String, Schema.Record(Schema.String, Schema.Boolean))),
    },
    {
        identifier: "Args",
        title: "filters.Args",
    }
) {}
