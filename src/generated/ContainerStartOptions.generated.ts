import * as Schema from "@effect/schema/Schema";

export class ContainerStartOptions extends Schema.Class<ContainerStartOptions>("ContainerStartOptions")(
    {
        CheckpointID: Schema.NullOr(Schema.String),
        CheckpointDir: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ContainerStartOptions",
        title: "types.ContainerStartOptions",
    }
) {}
