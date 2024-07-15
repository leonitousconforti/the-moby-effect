import * as Schema from "@effect/schema/Schema";

export class CheckpointDeleteOptions extends Schema.Class<CheckpointDeleteOptions>("CheckpointDeleteOptions")(
    {
        CheckpointID: Schema.NullOr(Schema.String),
        CheckpointDir: Schema.NullOr(Schema.String),
    },
    {
        identifier: "CheckpointDeleteOptions",
        title: "types.CheckpointDeleteOptions",
    }
) {}
