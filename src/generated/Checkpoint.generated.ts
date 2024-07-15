import * as Schema from "@effect/schema/Schema";

export class Checkpoint extends Schema.Class<Checkpoint>("Checkpoint")(
    {
        Name: Schema.NullOr(Schema.String),
    },
    {
        identifier: "Checkpoint",
        title: "types.Checkpoint",
    }
) {}
