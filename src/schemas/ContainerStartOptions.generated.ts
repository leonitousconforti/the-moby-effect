import * as Schema from "@effect/schema/Schema";

export class ContainerStartOptions extends Schema.Class<ContainerStartOptions>("ContainerStartOptions")({
    CheckpointID: Schema.String,
    CheckpointDir: Schema.String,
}) {}
