import * as Schema from "@effect/schema/Schema";

export class CheckpointCreateOptions extends Schema.Class<CheckpointCreateOptions>("CheckpointCreateOptions")({
    CheckpointID: Schema.String,
    CheckpointDir: Schema.String,
    Exit: Schema.Boolean,
}) {}
