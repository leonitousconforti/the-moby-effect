import * as Schema from "@effect/schema/Schema";

export class ContainerAttachOptions extends Schema.Class<ContainerAttachOptions>("ContainerAttachOptions")(
    {
        Stream: Schema.NullOr(Schema.Boolean),
        Stdin: Schema.NullOr(Schema.Boolean),
        Stdout: Schema.NullOr(Schema.Boolean),
        Stderr: Schema.NullOr(Schema.Boolean),
        DetachKeys: Schema.NullOr(Schema.String),
        Logs: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ContainerAttachOptions",
        title: "types.ContainerAttachOptions",
    }
) {}
