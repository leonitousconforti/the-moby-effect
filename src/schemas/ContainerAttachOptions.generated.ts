import * as Schema from "@effect/schema/Schema";

export class ContainerAttachOptions extends Schema.Class<ContainerAttachOptions>("ContainerAttachOptions")({
    Stream: Schema.Boolean,
    Stdin: Schema.Boolean,
    Stdout: Schema.Boolean,
    Stderr: Schema.Boolean,
    DetachKeys: Schema.String,
    Logs: Schema.Boolean,
}) {}
