import * as Schema from "effect/Schema";

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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/options.go#L57-L67",
    }
) {}
