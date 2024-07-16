import * as Schema from "@effect/schema/Schema";

export class Commit extends Schema.Class<Commit>("Commit")(
    {
        ID: Schema.String,
        Expected: Schema.String,
    },
    {
        identifier: "Commit",
        title: "types.Commit",
    }
) {}
