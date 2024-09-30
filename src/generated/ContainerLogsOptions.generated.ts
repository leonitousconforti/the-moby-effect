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
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/options.go#L57-L67",
    }
) {}
