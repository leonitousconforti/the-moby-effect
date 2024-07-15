import * as Schema from "@effect/schema/Schema";

export class CheckpointCreateOptions extends Schema.Class<CheckpointCreateOptions>("CheckpointCreateOptions")(
    {
        CheckpointID: Schema.NullOr(Schema.String),
        CheckpointDir: Schema.NullOr(Schema.String),
        Exit: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "CheckpointCreateOptions",
        title: "types.CheckpointCreateOptions",
    }
) {}
