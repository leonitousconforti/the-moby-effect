import * as Schema from "@effect/schema/Schema";

export class ContainerLogsOptions extends Schema.Class<ContainerLogsOptions>("ContainerLogsOptions")(
    {
        ShowStdout: Schema.Boolean,
        ShowStderr: Schema.Boolean,
        Since: Schema.String,
        Until: Schema.String,
        Timestamps: Schema.Boolean,
        Follow: Schema.Boolean,
        Tail: Schema.String,
        Details: Schema.Boolean,
    },
    {
        identifier: "ContainerLogsOptions",
        title: "container.LogsOptions",
    }
) {}
