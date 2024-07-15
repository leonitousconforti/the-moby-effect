import * as Schema from "@effect/schema/Schema";

export class CheckpointListOptions extends Schema.Class<CheckpointListOptions>("CheckpointListOptions")(
    {
        CheckpointDir: Schema.NullOr(Schema.String),
    },
    {
        identifier: "CheckpointListOptions",
        title: "types.CheckpointListOptions",
    }
) {}
