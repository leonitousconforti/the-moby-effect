import * as Schema from "@effect/schema/Schema";

export class ContainerLogsOptions extends Schema.Class<ContainerLogsOptions>("ContainerLogsOptions")(
    {
        ShowStdout: Schema.NullOr(Schema.Boolean),
        ShowStderr: Schema.NullOr(Schema.Boolean),
        Since: Schema.NullOr(Schema.String),
        Until: Schema.NullOr(Schema.String),
        Timestamps: Schema.NullOr(Schema.Boolean),
        Follow: Schema.NullOr(Schema.Boolean),
        Tail: Schema.NullOr(Schema.String),
        Details: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ContainerLogsOptions",
        title: "types.ContainerLogsOptions",
    }
) {}
