import * as Schema from "@effect/schema/Schema";

export class CheckpointDeleteOptions extends Schema.Class<CheckpointDeleteOptions>("CheckpointDeleteOptions")({
    CheckpointID: Schema.String,
    CheckpointDir: Schema.String,
}) {}
