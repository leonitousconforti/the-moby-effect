import * as Schema from "effect/Schema";

export class ContainerLogConfig extends Schema.Class<ContainerLogConfig>("ContainerLogConfig")(
    {
        Type: Schema.String,
        Config: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "ContainerLogConfig",
        title: "container.LogConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/hostconfig.go#L358-L362",
    }
) {}
