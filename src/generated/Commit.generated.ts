import * as Schema from "@effect/schema/Schema";

export class Commit extends Schema.Class<Commit>("Commit")(
    {
        ID: Schema.NullOr(Schema.String),
        Expected: Schema.NullOr(Schema.String),
    },
    {
        identifier: "Commit",
        title: "types.Commit",
    }
) {}
